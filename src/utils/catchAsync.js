const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const { statusCode, message } = err;
    if (statusCode && message) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    next(err);
  });
};

export default catchAsync;
