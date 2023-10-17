import { Rule, RuleObject } from 'antd/lib/form';
import { IntlShape } from 'react-intl';
import { validator } from './validator.validate';
interface Validate {
  [key: string]: Rule[];
}

const REGEX_URL = '';
const REGEX_PHONE_NUMBER = /^[A-Za-z\d#$@!%&*?.]{8,16}$/;
const POSTAL_CODE = '';

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
        message: intl.formatMessage({ id: 'validate.required.password' }),
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
    // editPassword: [
    //   {
    //     validator: validator({
    //       space: intl.formatMessage({
    //         id: 'validate.space',
    //       }),
    //       password: intl.formatMessage({
    //         id: 'validate.password',
    //       }),
    //     }),
    //   },
    // ],
    phoneNumber: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.phone.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.space',
          }),
          phone: intl.formatMessage({
            id: 'validate.phone',
          }),
        }),
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
    nameCategory: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.category-name' }),
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
    ],
    nameCustomer: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.customer-name' }),
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
    customerCode: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.customer-code.required' }),
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
  };
};
