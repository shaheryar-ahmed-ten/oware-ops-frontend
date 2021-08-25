const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const usernameRE = /^\w+$/i;
const phoneRE = /^\d( ?\d){10}$/;
const characterRE =  /^[a-zA-Z ]{3,30}$/;

const isRequired = value => !!value;
const isNotEmptyArray = arr => !!arr.length;
const isEmail = value => !!emailRE.test(value);
const isUsername = value => !!usernameRE.test(value);
const isPhone = value => !!phoneRE.test(value);
const isNumber = value => !isNaN(value);
const isChar = value => !!characterRE.test(value);
export {
  isRequired, isNotEmptyArray, isEmail, isUsername, isPhone, isNumber, isChar
}