const { Food } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const food = await Food.findAll({
      order: [["prior", "ASC"]],
      attributes: ["id", "name", "img", "price", "compo", "deli"],
    });

    return res.json(food);
  } catch (error) {
    return next(error);
  }
};
