const db = require("../db/db.js");

exports.getDashboardStats = async () => {
  try {
    console.log('📊 Fetching dashboard statistics...');

    /* ---------- TOTAL REVENUE ---------- */
    const revenueResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM payments
      WHERE status = 'success'
    `);
    const totalRevenue = revenueResult.rows[0].total;
    console.log('💰 Total Revenue:', totalRevenue);

    /* ---------- ACTIVE ESIMS (Success orders) ---------- */
    const activeEsimsResult = await db.query(`
      SELECT COUNT(*) AS count
      FROM payments
      WHERE status = 'success'
    `);
    const activeEsims = activeEsimsResult.rows[0].count;
    console.log('📱 Active eSIMs:', activeEsims);

    /* ---------- STOCK AVAILABLE ---------- */
    const stockResult = await db.query(`
      SELECT COUNT(*) AS count
      FROM numbers
      WHERE status = 'available'
    `);
    const stockAvailable = stockResult.rows[0].count;
    console.log('📦 Stock Available:', stockAvailable);

    /* ---------- PENDING ORDERS ---------- */
    const pendingOrdersResult = await db.query(`
      SELECT COUNT(*) AS count
      FROM payments
      WHERE status = 'pending'
    `);
    const pendingOrders = pendingOrdersResult.rows[0].count;
    console.log('⏳ Pending Orders:', pendingOrders);

    /* ---------- RECENT TRANSACTIONS (Last 5) ---------- */
    const transactionsResult = await db.query(`
      SELECT 
        id,
        order_id,
        phone_number,
        amount,
        status,
        TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
        created_at
      FROM payments
      ORDER BY created_at DESC
      LIMIT 5
    `);
    const recentTransactions = transactionsResult.rows;
    console.log('📋 Recent Transactions:', recentTransactions.length);

    const dashboardData = {
      totalRevenue,
      activeEsims,
      stockAvailable,
      pendingOrders,
      recentTransactions,
    };

    console.log('✅ Dashboard data prepared successfully');
    return dashboardData;

  } catch (err) {
    console.error('❌ Dashboard service error:', err);
    throw err;
  }
};