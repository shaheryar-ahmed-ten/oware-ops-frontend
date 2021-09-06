import { createContext } from "react";
import moment from 'moment';

export const apiBaseURL = (process.env.NODE_ENV === 'development' ? 'http://192.168.18.5:3000' : '') + '/api/v1';

export const getURL = (...args) => {
  return [apiBaseURL, ...Array.from(args)].join('/');
}

export const digitize = (value, places) => {
  let strVal = (value + '');
  return new Array(places - strVal.length).fill('0').join('') + strVal;
}

export const dateFormat = value => value ? moment(value).utcOffset(value).format('DD-MM-yyyy hh:mm A') : "-";

export const dateToPickerFormat = value => value ? moment(value).format('yyyy-MM-DDTHH:mm') : "-";

export const SharedContext = createContext(null);

String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

export const checkForMatchInArray = (array, propertyToMatch, valueToMatch) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i][propertyToMatch] == valueToMatch)
      return true;
  }
  return false;
}