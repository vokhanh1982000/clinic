import emojiRegex from 'emoji-regex';
import * as _ from 'lodash';
import isEmail from 'validator/lib/isEmail';
import isFloat from 'validator/lib/isFloat';
import isLength from 'validator/lib/isLength';
import isURL from 'validator/lib/isURL';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

type Optịon = {
  message: string;
  min?: number;
  max?: number;
};

type validateType =
  | 'emoj'
  | 'required'
  | 'normal'
  | 'email'
  | 'phone'
  | 'isLength'
  | 'isFloat'
  | 'isUrl'
  | 'kana'
  | 'space'
  | 'postalCode'
  | 'password';

type ValidatorOption = string | boolean | Optịon;
type Validators = { [key in validateType]?: ValidatorOption };

const regexEmoj = emojiRegex();
const regexNormal = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const regexPass = /^[A-Za-z\d#$@!%&*?.]{8,16}$/;
const regexKana = /^([ァ-ン]|ー)+$/;
const regexPosTalCode = /^\d{3}-\d{4}$/;
const REGEX_PHONE_NUMBER = /^0[1-9][0-9]{8}$/;

const getMessage = (option: ValidatorOption): string => {
  return typeof option === 'object' ? option.message : (option as string);
};

const VALIDATOR: any = {
  required: (value: string | number | undefined | null, option: ValidatorOption) => {
    if (value === undefined || value === null) {
      throw new Error(getMessage(option));
    }

    const type = typeof value;
    let isValid = true;
    if (type === 'string') {
      isValid = !!(value as string).trim();
    }

    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  password: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }

    const isValid = regexPass.test(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  emoj: (value: string, option: ValidatorOption) => {
    const isValid = !regexEmoj.test(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  normal: (value: string, option: ValidatorOption) => {
    const isValid = !regexNormal.test(value) && !regexEmoj.test(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  kana: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }

    const isValid = regexKana.test(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  space: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }

    const isValid = value === value.trimStart();
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  email: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }

    const isValid = isEmail(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  phone: (value: string, option: ValidatorOption) => {
    if (!value) {
      return;
    }

    // const isValid = isValidPhoneNumber(value, 'VN');
    // const possible = isPossiblePhoneNumber(value, 'VN');
    if (/* !isValid || !possible || */ !REGEX_PHONE_NUMBER.test(value)) {
      throw new Error(getMessage(option));
    }
  },
  isLength: (value: string, option: Optịon) => {
    const isValid = isLength(value, option);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  isFloat: (value: number, option: Optịon) => {
    const isValid = isFloat(value + '', option);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  isUrl: (value: number, option: Optịon) => {
    if (!value) {
      return;
    }

    const isValid = isURL(value + '');
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
  postalCode: (value: string, option: Optịon) => {
    if (!value) {
      return;
    }

    const isValid = regexPosTalCode.test(value);
    if (!isValid) {
      throw new Error(getMessage(option));
    }
  },
};

export const validator = (validators: Validators) => {
  return async (rule: any, text: string) => {
    _.map(validators, (options, type) => {
      options && VALIDATOR[type] && VALIDATOR[type](text, options);
    });
  };
};
