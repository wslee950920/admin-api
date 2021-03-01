const { Notice } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Notice.destroy({ where: { id } });

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
