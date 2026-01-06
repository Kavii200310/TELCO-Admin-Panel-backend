const db = require("../db/db.js");

exports.getAllOrders = async () => {
  try {
    console.log('📦 Fetching orders from payments table...');
    
    const result = await db.query(`
      SELECT
        id,
        order_id,
        phone_number,
     
        payment_method,
        status,
        amount,
        created_at
      FROM payments
      ORDER BY created_at DESC
    `);

    console.log(`✅ Found ${result.rows.length} orders in database`);
    
    // Log first order for debugging (if exists)
    if (result.rows.length > 0) {
      console.log('📄 Sample order from DB:', result.rows[0]);
    }

    return result.rows;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

exports.getOrderById = async (id) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        order_id,
        phone_number,
    
        payment_method,
        status,
        amount,
        created_at
      FROM payments
      WHERE id = $1
    `, [id]);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

exports.createOrder = async (data) => {
  try {
    const { order_id, phone_number, payment_method, status, amount } = data;

    const result = await db.query(`
      INSERT INTO payments (order_id, phone_number,  payment_method, status, amount, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `, [order_id, phone_number, payment_method, status, amount]);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Database insert error:', error);
    throw error;
  }
};

exports.updateOrder = async (id, data) => {
  try {
    const { status, amount, payment_method } = data;

    const result = await db.query(`
      UPDATE payments
      SET 
        status = COALESCE($1, status),
        amount = COALESCE($2, amount),
        payment_method = COALESCE($3, payment_method)
      WHERE id = $4
      RETURNING *
    `, [status, amount, payment_method, id]);

    return result.rows[0];
  } catch (error) {
    console.error('❌ Database update error:', error);
    throw error;
  }
};

exports.deleteOrder = async (id) => {
  try {
    await db.query("DELETE FROM payments WHERE id = $1", [id]);
  } catch (error) {
    console.error('❌ Database delete error:', error);
    throw error;
  }
};