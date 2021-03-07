const joi = require("joi");

const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    reviewId: joi.number().required(),
    content: joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { content, reviewId } = req.body;
  try {
    const comment = await Comment.create({
      content,
      adminId: req.user.id,
      reviewId,
    });

    return res.json(comment);
  } catch (error) {
    return next(error);
  }
};
