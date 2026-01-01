const db = require("../db/db.js");

exports.getAllOrders = async () => {
  const result = await db.query(`
    SELECT
      id::text AS id,
      phone AS customer,
      COALESCE(payment_method, 'Cash') AS payment,
      'eSIM' AS type,
      status,
      amount,
      TO_CHAR(created_at, 'YYYY-MM-DD') AS date
    FROM payments
    ORDER BY created_at DESC
  `);

  return result.rows;
};
