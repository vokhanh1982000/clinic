import _ from 'lodash';

export const isEmpty = (text: string) => {
  if (_.isNil(text)) {
    return true;
  }
  if (_.isEmpty(text.trim())) {
    return true;
  }
  return false;
};

export const isEmail = (email: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(email);
};

export const validateMinLength = (text: string, min: number) => {
  if (_.isNil(text)) {
    return true;
  }
  return text.length < min;
};
export const validateMaxLength = (text: string, max: number) => {
  if (_.isNil(text)) {
    return false;
  }
  return text.length > max;
};
export const isDitgit = (text: string) => {
  let reg = /^[0-9]*$/;
  return reg.test(text);
};
export const isPhoneNumber = (text: string) => {
  let reg = /^0[1-9][0-9]{8}$/;
  return reg.test(text);
};
