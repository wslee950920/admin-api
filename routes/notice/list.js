const joi = require("joi");

const { Notice } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    page: joi.number().integer().min(1).required(),
  });
  const result = schema.validate(req.query);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    const notices = await Notice.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (req.query.page - 1) * 10,
    });

    return res
      .set("Last-Page", Math.ceil(notices.count / 10))
      .json(notices.rows);
  } catch (error) {
    return next(error);
  }
};
