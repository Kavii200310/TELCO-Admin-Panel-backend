const express = require("express");
const cors = require("cors");

const inventoryController = require("./src/controllers/inventoryController");
const dashboardController = require("./src/controllers/dashboardController");
const orderController = require("./src/controllers/orderController");

const app = express();
app.use(cors());
app.use(express.json());


console.log({
  inventory: inventoryController.getNumbers,
  dashboard: dashboardController.getDashboard,
  orders: orderController.getOrders,
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

app.listen(5000, () => {
  console.log("TELCO Admin Panel Backend running on port 5000");
});
