
const db = require("../db/db.js");
const bcrypt = require("bcrypt");

bcrypt.hash("password123", 10).then(hash => {
  console.log(hash);
});

const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET || "1234";
const JWT_EXPIRES_IN = "7d"; 


exports.createSuperAdmin = async (name, email, password) => {
  try {
    console.log('🛡️ Creating Super Admin:', email);

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Super Admin already exists with this email');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert super admin user
    const result = await db.query(
      `INSERT INTO admin_users (email, password, role, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, email, role`,
      [email, hashedPassword, 'SUPER_ADMIN']
    );

    console.log('✅ Super Admin created successfully:', email);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    console.log('🔐 Attempting login for:', email);

    // Find user by email
    const result = await db.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found:', email);
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

  

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      throw new Error('Invalid email or password');
    }

    // Update last login timestamp
    // await db.query(
    //   'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
    //   [user.id]
    // );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('✅ Login successful for:', email);

    // Return user data (without password) and token
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
     
      }
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * Verify JWT token
 */
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (userId) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role FROM admin_users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('❌ Get user error:', error);
    throw error;
  }
};

/**
 * Create a new admin user (for initial setup)
 */
exports.createAdminUser = async (name, email, password, role = 'admin') => {
  try {
    console.log('👤 Creating new admin user:', email);

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.query(`
      INSERT INTO admin_users (name, email, password, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, email, role
    `, [name, email, hashedPassword, role]);

    console.log('✅ Admin user created:', email);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Create user error:', error);
    throw error;
  }
};