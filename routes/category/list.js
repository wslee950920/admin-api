const { Food, Category } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [
        ["prior", "ASC"],
        [Food, "prior", "ASC"],
      ],
      attributes: ["id", "category"],
      include: {
        model: Food,
        attributes: ["id", "name", "img", "price", "compo", "deli"],
      },
    });

    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};
