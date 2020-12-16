const passport = require("passport");

const Login = (req, res, next) => {
  passport.authenticate("local", (authError, result) => {
    if (authError) {
      console.error(authError);

      return next(authError);
    }
    if (!result) {
      return res.status(401).end();
    }

    return req.login(result, (loginError) => {
      if (loginError) {
        console.error(loginError);

        return next(loginError);
      }

      return res.json(result);
    });
  })(req, res, next);
};

module.exports = Login;
