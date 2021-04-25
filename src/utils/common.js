import { createContext } from "react";
import moment from 'moment';

export const apiBaseURL = (process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : '') + '/api/v1';
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

export const getURL = uri => {
  return `${apiBaseURL}${uri}`;
}

export const isSuperAdmin = user => {
  return user && user.Role && user.Role.PermissionAccesses.find(pa => pa.Permission.type == 'superadmin_privileges');
}

export const digitize = (value, places) => {
  let strVal = (value + '');
  return new Array(places - strVal.length).fill('0').join('') + strVal;
}

export const dateFormat = value => moment(value).format('DD-MM-yyyy hh:mm A');

export const dateToPickerFormat = value => moment(value).format('yyyy-MM-DDTHH:mm')

export const SharedContext = createContext(null);
