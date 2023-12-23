exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split(';')[0].trim().split('=')[1] === 'true';
  console.log(req.session);
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-age=10')
  req.session.isLoggedIn = true;
  res.redirect("/");
};
