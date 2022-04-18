const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("token"); //Hämtar token från header
  if (!token)
    //Om token inte finns
    return res.status(401).json({ Message: "No authentication token found" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET); //Kontrollerar token mot process.env.TOKEN_SECRET
    req.user = verified.user; //Sätter req.user till den som är inloggad
    next();
  } catch (err) {
    res.status(401).json({ Message: "Not a valid token" }); //Om token inte är giltig
  }
};
