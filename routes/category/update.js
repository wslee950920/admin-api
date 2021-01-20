const joi = require("joi");

const { Category } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const schema = joi.object().keys({
    category: joi.string().max(20),
    prior: joi.number(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    await Category.update(req.body, { where: { id } });

    res.json({ updated: id, ...req.body });
  } catch (e) {
    next(e);
  }
};
