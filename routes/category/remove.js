const { Category, sequelize, Food } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const t = await sequelize.transaction();
  try {
    await Food.destroy({ where: { categoryId: id }, transaction: t });
    await Category.destroy({ where: { id }, transaction: t });

    await t.commit();

    res.json({ deleted: id });
  } catch (e) {
    await t.rollback();

    next(e);
  }
};
