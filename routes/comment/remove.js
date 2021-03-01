const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Comment.destroy({ where: { id } });

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
