const joi = require("joi");

const { Category } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    category: joi.string().max(20).required(),
    prior: joi.number(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { category, prior } = req.body;
  try {
    const exCategory = await Category.findOne({ where: { category } });
    if (exCategory) {
      return res.status(409).end();
    }

    const newCategory = await Category.create({
      category,
      prior,
    });

    return res.json(newCategory);
  } catch (error) {
    return next(error);
  }
};

module.exports = Register;
