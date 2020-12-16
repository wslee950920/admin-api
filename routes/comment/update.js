const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Comment.update({ content: req.body.content }, { where: { id } });

    res.end();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
