export default {
  en: {
    port_in_use: (bind) => `The port ${bind} is already in use.`,
    invalid_permission: (bind) =>
      `Port ${bind} requires administrator privileges.`,
    started_app: (bind) => `Started at the port ${bind}.`,
    unexpected_error: "A system error has occurred.",
  },
};
