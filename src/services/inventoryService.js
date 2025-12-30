const db = require("../db/db.js");

exports.getAllNumbers = async () => {
  const result = await db.query("SELECT * FROM numbers ORDER BY id DESC");
  return result.rows;
};

exports.addNumber = async (data) => {
  const { phone_number, category, status, price, type } = data;

  const result = await db.query(
    `INSERT INTO numbers (phone_number, category, status, price, type)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [phone_number, category, status, price, type]
  );

  return result.rows[0];
};

exports.updateNumber = async (id, data) => {
  const { category, status, price, type } = data;

  const result = await db.query(
    `UPDATE numbers 
     SET category=$1, status=$2, price=$3, type=$4
     WHERE id=$5 RETURNING *`,
    [category, status, price, type, id]
  );

  return result.rows[0];
};

exports.deleteNumber = async (id) => {
  await db.query("DELETE FROM numbers WHERE id=$1", [id]);
};
