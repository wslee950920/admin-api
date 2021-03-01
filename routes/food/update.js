const joi = require("joi");

const { Food } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const schema = joi.object().keys({
    name: joi.string().max(20),
    img: joi.string().max(20),
    price: joi.number(),
    compo: joi.string(),
    prior: joi.number(),
    deli: joi.boolean(),
    categoryId: joi.number(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    await Food.update(req.body, { where: { id } });

    return res.json({ updated: id, ...req.body });
  } catch (error) {
    return next(error);
  }
};
