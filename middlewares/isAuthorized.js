const [path] = [require("path")];
const { verify } = require("jsonwebtoken");
const User = require(path.join(__dirname, "..", "models", "User"));
exports.isAuthorized = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .status(400)
      .json({ success: false, error: `you're unauthorized.` });
  const token = authorization.replace("Bearer ", "");
  verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: `No valid user token found.` });
    const { _id } = decoded;
    User.findById(_id)
      .select("username email _id")
      .exec((err, user) => {
        if (err || !user)
          return res
            .status(500)
            .json({ success: false, error: `No valid user found.` });
        req.user = user;
        next();
      });
  });
};
