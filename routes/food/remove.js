const { Food } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Food.destroy({ where: { id } });

    res.json({ deleted: id });
  } catch (e) {
    next(e);
  }
};
