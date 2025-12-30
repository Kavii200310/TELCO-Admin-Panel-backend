const db = require("../db/db.js");

exports.getAllOrders = async () => {
  const result = await db.query(
    "SELECT * FROM payments ORDER BY created_at DESC"
  );
  return result.rows;
};
