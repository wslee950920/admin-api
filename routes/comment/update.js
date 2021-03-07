const joi = require("joi");

const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    content: joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { id } = req.params;
  try {
    await Comment.update({ content: req.body.content }, { where: { id } });

    return res.end();
  } catch (error) {
    return next(error);
  }
};
