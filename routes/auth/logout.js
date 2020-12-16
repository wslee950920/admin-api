const Logout = (req, res, next) => {
  req.logout();
  req.session.destroy();

  res.status(204).end();
};

module.exports = Logout;
