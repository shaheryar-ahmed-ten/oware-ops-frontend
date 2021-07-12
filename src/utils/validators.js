const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const usernameRE = /^\w+$/i;
const phoneRE = /^\d( ?\d){10}$/;

const isRequired = value => !!value;
const isNotEmptyArray = arr => !!arr.length;
const isEmail = value => !!emailRE.test(value);
const isUsername = value => !!usernameRE.test(value);
const isPhone = value => !!phoneRE.test(value);
const isNumber = value => !isNaN(value);
export {
  isRequired, isNotEmptyArray, isEmail, isUsername, isPhone, isNumber
}