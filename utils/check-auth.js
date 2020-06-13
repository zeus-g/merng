const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch {
        throw new AuthenticationError("token kadaluarsa atau tidak berlaku");
      }
    }
    throw new Error("auth token tidak boleh illegal");
  }
  throw new Error("Auth harus ada");
};
