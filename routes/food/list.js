const { Food } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const food = await Food.findAll({
      order: [["prior", "ASC"]],
      attributes: ["id", "name", "img", "price", "compo", "deli"],
    });

    res.json(food);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
