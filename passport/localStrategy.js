const LocalStrategy = require("passport-local").Strategy;

const { Admin } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exAdmin = await Admin.findByEmail(email);
          if (exAdmin) {
            const result = await exAdmin.checkPassword(password);
            if (result) {
              const data = exAdmin.serialize();
              done(null, data);
            } else {
              done(null, false);
            }
          } else {
            done(null, false);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
