export default {
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: 30,
  },
};
