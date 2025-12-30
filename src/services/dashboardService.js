const db = require("../db/db.js");

exports.getDashboardStats = async () => {
  const revenue = await db.query(
    "SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='Completed'"
  );

  const activeEsims = await db.query(
    "SELECT COUNT(*) FROM qr_scans WHERE status='Activated'"
  );

  const stock = await db.query(
    "SELECT COUNT(*) FROM numbers WHERE status='Available'"
  );

  const pendingOrders = await db.query(
    "SELECT COUNT(*) FROM payments WHERE status='Pending'"
  );

  const recentTransactions = await db.query(
    "SELECT * FROM payments ORDER BY created_at DESC LIMIT 5"
  );

  return {
    totalRevenue: revenue.rows[0].coalesce,
    activeEsims: activeEsims.rows[0].count,
    stockAvailable: stock.rows[0].count,
    pendingOrders: pendingOrders.rows[0].count,
    recentTransactions: recentTransactions.rows,
  };
};
