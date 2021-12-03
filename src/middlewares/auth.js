import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { rolePermissions } from "../config/roles";

const verifyCallback =
  (req, resolve, reject, requiredPermissions) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = user;

    if (requiredPermissions.length) {
      const userPermissions = user.roles
        .map((role) => rolePermissions[role])
        .flat();

      const checked = requiredPermissions.some((requiredPermission) =>
        userPermissions.includes(requiredPermission)
      );

      if (!checked || req.params.userId === user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredPermissions) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredPermissions)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => {
        next(err);
      });
  };

export default auth;
