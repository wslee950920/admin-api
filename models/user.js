module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      eVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
      },
      detail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
      },
      phone: {
        type: DataTypes.STRING(11),
        allowNull: true,
        unique: true,
      },
      pVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
      collate: "utf8mb4_general_ci",
    }
  );

  return User;
};
