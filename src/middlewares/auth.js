import passport from "passport";
import * as CreateError from "http-errors";
import { rolePermissions } from "../config/roles";

const verifyCallback =
  (req, resolve, reject, requiredPermissions) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(new CreateError.Unauthorized("Please authenticate"));
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
        return reject(new CreateError.Forbidden("Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredPermissions) =>
  async (req, res, next) =>
    new Promise((resolve, reject) => {
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

export default auth;
