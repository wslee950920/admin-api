const joi = require("joi");

const { Admin } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().max(40).required(),
    nick: joi.string().max(20),
    password: joi.string().max(100).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { email, nick, password } = req.body;
  try {
    const exAdmin = await Admin.findByEmail(email);
    if (exAdmin) {
      return res.status(409).end();
    }

    const admin = Admin.build({
      email,
      nick,
    });
    await admin.setPassword(password);
    await admin.save();

    return res.json(admin.serialize());
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

module.exports = Register;
