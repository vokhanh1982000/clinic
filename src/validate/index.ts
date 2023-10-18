import { Rule, RuleObject } from 'antd/lib/form';
import { IntlShape } from 'react-intl';
import { validator } from './validator.validate';
interface Validate {
  [key: string]: Rule[];
}

const REGEX_URL = '';
const REGEX_PHONE_NUMBER = /^0[1-9][0-9]{8}$/;
const POSTAL_CODE = '';
const START_SPACE = /^(?![\s])[\s\S]*/;

export const ValidateLibrary: (intl: IntlShape) => Validate = (intl) => {
  return {
    email: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.required' }),
      // },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.space',
          }),
          email: intl.formatMessage({
            id: 'validate.email',
          }),
        }),
      },
    ],
    password: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.space',
          }),
          password: intl.formatMessage({
            id: 'validate.password',
          }),
        }),
      },
    ],
    editPassword: [
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.space',
          }),
          password: intl.formatMessage({
            id: 'validate.password',
          }),
        }),
      },
    ],
    phoneNumber: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.phone.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(REGEX_PHONE_NUMBER);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.phone.space',
              })
            );
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.phone.space',
            })
          );
        },
      },
    ],
    dob: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.required' }),
      // },
    ],
    name: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
      {
        min: 4,
        message: intl.formatMessage({ id: 'validate.min_4_char' }),
      },
    ],
    nameService: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        min: 1,
        message: intl.formatMessage({ id: 'validate.min_1_char' }),
      },
    ],
    age: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
    ],
    image: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
    ],
    required: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
    ],
    userCode: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
      {
        min: 4,
        message: intl.formatMessage({ id: 'validate.min_4_char' }),
      },
    ],
    space: [
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
    url: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(REGEX_URL);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.isUrl',
            })
          );
        },
      },
    ],
    postalCode: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(POSTAL_CODE);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.postalCode',
            })
          );
        },
      },
    ],
    fullName: [
      {
        required: true,
        message: intl.formatMessage({ id: 'common.noti.input' }),
      },
      {
        max: 36,
        message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
      },
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(START_SPACE);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.space',
            })
          );
        },
      },
    ],
    code: [
      {
        required: true,
        message: intl.formatMessage({ id: 'common.noti.input' }),
      },
      {
        max: 36,
        message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
      },
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
          space: intl.formatMessage({ id: 'validate.no.space' }),
        }),
      },
    ],
    position: [
      {
        max: 36,
        message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
      },
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(START_SPACE);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.space',
            })
          );
        },
      },
    ],
    level: [
      {
        max: 36,
        message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
      },
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(START_SPACE);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.space',
            })
          );
        },
      },
    ],
    address: [
      {
        max: 36,
        message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
      },
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
      {
        validator(_: RuleObject, value: string) {
          const regex = new RegExp(START_SPACE);
          if (regex.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            intl.formatMessage({
              id: 'validate.space',
            })
          );
        },
      },
    ],
    passwordCustom: [
      {
        required: true,
        message: intl.formatMessage({ id: 'common.noti.input' }),
      },
      {
        min: 8,
        message: intl.formatMessage({ id: 'validate.password.min' }),
      },
      {
        max: 16,
        message: intl.formatMessage({ id: 'validate.password.max' }),
      },
      {
        validator: validator({
          password: intl.formatMessage({ id: 'validate.password' }),
        }),
      },
    ],
  };
};
