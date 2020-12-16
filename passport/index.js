const local = require("./localStrategy");
const { Admin } = require("../models");

module.exports = (passport) => {
  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser((id, done) => {
    Admin.findByPk(id)
      .then((admin) => done(null, admin))
      .catch((err) => done(err));
  });

  local(passport);
};
