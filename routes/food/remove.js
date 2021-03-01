const { Food } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Food.destroy({ where: { id } });

    return res.json({ deleted: id });
  } catch (error) {
    return next(error);
  }
};
