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
db.User = require("./user")(sequelize, Sequelize);
db.Detail = require("./detail")(sequelize, Sequelize);
db.Order = require("./order")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);

db.User.hasMany(db.Order, {
  foreignKey: { name: "customerId" },
  onDelete: "SET NULL",
  sourceKey: "id",
});
db.Order.belongsTo(db.User, {
  foreignKey: "customerId",
  onDelete: "SET NULL",
  targetKey: "id",
});

db.User.hasMany(db.Review, { onDelete: "SET NULL" });
db.Review.belongsTo(db.User, { onDelete: "SET NULL" });

db.Review.hasMany(db.Comment, { foreignKey: { allowNull: false } });
db.Comment.belongsTo(db.Review, { foreignKey: { allowNull: false } });

db.Hashtag.belongsToMany(db.Review, { through: "ReviewHashtag" });
db.Review.belongsToMany(db.Hashtag, { through: "ReviewHashtag" });

db.Admin.hasMany(db.Notice, { onDelete: "SET NULL" });
db.Notice.belongsTo(db.Admin, { onDelete: "SET NULL" });

db.Admin.hasMany(db.Comment, { onDelete: "SET NULL" });
db.Comment.belongsTo(db.Admin, { onDelete: "SET NULL" });

db.Category.hasMany(db.Food, { foreignKey: { allowNull: false } });
db.Food.belongsTo(db.Category, { foreignKey: { allowNull: false } });

db.Food.hasMany(db.Detail, { foreignKey: { allowNull: false } });
db.Detail.belongsTo(db.Food, { foreignKey: { allowNull: false } });

db.Order.hasMany(db.Detail, { foreignKey: { allowNull: false } });
db.Detail.belongsTo(db.Order, { foreignKey: { allowNull: false } });

module.exports = db;
