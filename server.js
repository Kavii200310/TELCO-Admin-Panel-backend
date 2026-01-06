const express = require("express");
const cors = require("cors");

const inventoryController = require("./src/controllers/inventoryController");
const dashboardController = require("./src/controllers/dashboardController");
const orderController = require("./src/controllers/orderController");
const authController = require("./src/controllers/authController");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true
}));

app.use(express.json());


console.log({
  inventory: inventoryController.getNumbers,
  dashboard: dashboardController.getDashboard,
  orders: orderController.getOrders,
 
  authProfile: authController.getProfile,
  authLogin: authController.login,
  authVerifyToken: authController.verifyToken,
  authGetUserById: authController.getUserById,  

});

// Inventory
app.get("/admin/numbers", inventoryController.getNumbers);
app.post("/admin/numbers", inventoryController.createNumber);
app.put("/admin/numbers/:id", inventoryController.updateNumber);
app.delete("/admin/numbers/:id", inventoryController.deleteNumber);

// Dashboard
app.get("/admin/dashboard", dashboardController.getDashboard);

// Orders
app.get("/admin/orders", orderController.getOrders);



///login
app.post("/auth/createSuperUser", authController.createSuperAdmin);
app.post("/auth/login", authController.login);
//get profile
app.get("/auth/me", authController.getProfile);   

//verify token
app.post("/auth/verify", authController.verifyToken);
//get user by id
app.get("/auth/users/:id", authController.getUserById); 

console.log("\n🚀 Available API Endpoints:")  ;
console.log("\n📦 Inventory Routes:")
  console.log('  GET    /admin/numbers');
  console.log('  POST   /admin/numbers');
  console.log('  PUT    /admin/numbers/:id');
  console.log('  DELETE /admin/numbers/:id'); 
console.log("\n📊 Dashboard Routes:");
  console.log('  GET    /admin/dashboard');
console.log("\n🛒 Order Routes:");
  console.log('  GET    /admin/orders'); 
console.log("\n🔐 Authentication Routes:");


 console.log('  POST   /auth/login');
  console.log('  POST   /auth/logout');
  console.log('  POST   /auth/create-admin (initial setup)');
  console.log('\n🔒 Protected Routes (require JWT token):');
  //console.log('  GET    /auth/me');



  app.listen(5000, () => {
  console.log("TELCO Admin Panel Backend running on port 5000");
});