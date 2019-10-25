const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

function getUserId(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  console.log(Object.keys(context));
  console.log(Object.keys(context.request));
  console.log(Object.keys(context.request.get("Authorization")));
  throw new Error(`Not authenticated`);
}

module.exports = {
  APP_SECRET,
  getUserId,
};
