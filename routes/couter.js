const mysql = require("mysql2/promise");

module.exports = async (req, res, next) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.SEQUELIZE_PROD_HOST,
      user: process.env.SEQUELIZE_PROD_USERNAME,
      database: "gatmauel_deploy",
      password: process.env.SEQUELIZE_PROD_PASSWORD,
    });

    const [
      visitors,
    ] = await connection.execute(
      `SELECT c1.count AS today, SUM(c2.count) AS total FROM counter c1, counter c2 WHERE c1.date=?`,
      [new Date().toLocaleDateString()]
    );
    const [users] = await connection.execute(
      `SELECT COUNT(*) AS users FROM users`
    );

    return res.json({
      today: visitors[0].today ? parseInt(visitors[0].today) : 0,
      total: visitors[0].total ? parseInt(visitors[0].total) : 0,
      users: users[0].users,
    });
  } catch (error) {
    return next(error);
  }
};
