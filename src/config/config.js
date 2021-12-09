export default {
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET || "access-token-secret",
    accessExpiration: 30,
  },
};
