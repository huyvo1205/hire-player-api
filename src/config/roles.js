export const roles = {
    user: "roles_user",
    root: "roles_root",
    admin: "roles_admin"
}

export const permissions = {
    getUsers: "permissions_getUsers",
    manageUsers: "permissions_manageUsers"
}

export const rolePermissions = {
    [roles.user]: [],
    [roles.root]: Object.values(permissions),
    [roles.admin]: [permissions.getUsers, permissions.manageUsers]
}
