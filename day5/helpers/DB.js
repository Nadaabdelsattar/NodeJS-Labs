const mysql = require("mysql2/promise");

const query = async (sql, params = []) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "nodeapp",
      database: "auth_demo",
      password: "P@ssw0rd",
    });

    const [results, fields] = await connection.execute(sql, params);

    console.log(results);
    console.log(fields);

    return results;
  } catch (err) {
    console.error("DB error:", err);
    throw err;
  }
};

module.exports = { query };
