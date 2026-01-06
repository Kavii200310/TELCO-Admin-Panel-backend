const authService = require("../services/authService.js");


exports.createSuperAdmin = async (req, res) => {   
  try {       
    const { name, email, password } = req.body;

    const data = await authService.createSuperAdmin(name, email, password);

    res.json(data);
  } catch (err) {        
    res.status(400).json({ message: err.message });    
  }       
};


exports.login = async (req, res) => {   
  try {       
    const { email, password } = req.body;

    const data = await authService.loginUser(email, password);

    // ✅ send EXACT service response
    res.json(data);

  } catch (err) {        
    res.status(401).json({ message: err.message });    
  }       
};


exports.getProfile = async (req, res) => {    
    try {        
        const userProfile = await authService.getUserProfile(req.user.id);        
        res.json(userProfile);    
    } catch (err) {        
        res.status(500).json({ error: err.message });    
    }       
};          
exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  
        const decoded = authService.verifyToken(token);        
        res.json({ valid: true, decoded });    
    } catch (err) {        
        res.status(401).json({ valid: false, error: err.message });    
    }   
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;        
        const user = await authService.getUserById(userId);        
        res.json(user);    
    } catch (err) {        
        res.status(500).json({ error: err.message });    
    }   
};      

