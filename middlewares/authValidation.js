const Joi = require("@hapi/joi");

exports.signupValidation = async (req, res, next) => {
  const { username, password, email } = req.body;
  const schema = Joi.object({
    username: Joi.string().required().min(4).max(25),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().required().min(8).max(25),
  });
  const { error } = schema.validate({ username, password, email });
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  next();
};

exports.changePasswordValidation = async (req, res, next) => {
  const {password, newPassword } = req.body;
  const schema = Joi.object({
    password: Joi.string().required().min(8).max(25),
    newPassword : Joi.ref('password')
  });
  const { error } = schema.validate({ password, newPassword });
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  next();
};

exports.resetPasswordValidation = async (req, res, next) => {
  const {password} = req.body;
  const schema = Joi.object({
    password: Joi.string().required().min(8).max(25)
  });
  const { error } = schema.validate({ password });
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  next();
};