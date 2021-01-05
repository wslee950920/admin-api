const { Food, Category } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [["prior", "ASC"]],
      attributes: ["id", "category"],
      include: {
        model: Food,
        attributes: ["id", "name", "img", "price", "compo", "deli"],
        order: ["prior", "asc"],
      },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
