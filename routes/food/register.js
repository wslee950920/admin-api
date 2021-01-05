const joi = require("joi");

const { Food } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    name: joi.string().max(20).required(),
    img: joi.string().max(20).required(),
    price: joi.number().required(),
    compo: joi.string(),
    prior: joi.number(),
    deli: joi.boolean(),
    categoryId: joi.number(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { name, img, price, compo, prior, deli, categoryId } = req.body;
  try {
    const exFood = await Food.findOne({ where: { name } });
    if (exFood) {
      return res.status(409).end();
    }

    const newFood = await Food.create({
      name,
      img,
      price,
      compo,
      prior,
      deli,
      categoryId,
    });

    return res.json(newFood);
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

module.exports = Register;
