"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Food = require("./food")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.Notice = require("./notice")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Admin = require("./admin")(sequelize, Sequelize);
db.Review = require("./review")(sequelize, Sequelize);

db.Admin.hasMany(db.Notice, { onDelete: "SET NULL" });
db.Notice.belongsTo(db.Admin, { onDelete: "SET NULL" });

db.Review.hasMany(db.Comment, { foreignKey: { allowNull: false } });
db.Comment.belongsTo(db.Review, { foreignKey: { allowNull: false } });

db.Admin.hasMany(db.Comment, { onDelete: "SET NULL" });
db.Comment.belongsTo(db.Admin, { onDelete: "SET NULL" });

db.Category.hasMany(db.Food, { foreignKey: { allowNull: false } });
db.Food.belongsTo(db.Category, { foreignKey: { allowNull: false } });

module.exports = db;
