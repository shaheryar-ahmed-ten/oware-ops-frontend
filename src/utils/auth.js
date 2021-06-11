export const user = null;

export const getUserToken = () => {
  return localStorage.getItem('token');
}

export const getUser = () => {
  let user = localStorage.getItem('user');
  return user && JSON.parse(user);
}

export const setUserToken = token => {
  localStorage.setItem('token', token);
}

export const setUser = user => {
  localStorage.setItem('user', JSON.stringify(user));
}

export const removeUserToken = () => {
  localStorage.removeItem('token');
}

export const removeUser = () => {
  localStorage.removeItem('user');
}

export const removeAuth = () => {
  removeUserToken();
  removeUser();
}

export const checkPermission = (user, permission) => {
  console.log(user)
  console.log(user.Role)
  console.log(user.Role.PermissionAccesses)
  return user &&
    user.Role &&
    user.Role.PermissionAccesses.find((permissionAccess) =>
      permissionAccess.Permission.type == permission);
}
