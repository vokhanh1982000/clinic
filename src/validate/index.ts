import { Rule, RuleObject } from 'antd/lib/form';
import { IntlShape } from 'react-intl';
import { validator } from './validator.validate';
interface Validate {
  [key: string]: Rule[];
}

const REGEX_URL = '';
const REGEX_PHONE_NUMBER = /^0[1-9][0-9]{8}$/;
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
            id: 'validate.email.space',
          }),
          email: intl.formatMessage({
            id: 'validate.email.space',
          }),
        }),
      },
    ],
    // password: [
    //   {
    //     required: true,
    //     message: intl.formatMessage({ id: 'validate.required' }),
    //   },
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
        validator(_: RuleObject, value: string) {
          if (value) {
            if (value.trimStart() !== value) {
              return Promise.reject(
                intl.formatMessage({
                  id: 'validate.space',
                })
              );
            } else {
              const regex = new RegExp(REGEX_PHONE_NUMBER);
              if (!regex.test(value)) {
                return Promise.reject(
                  intl.formatMessage({
                    id: 'validate.phone',
                  })
                );
              }
            }
          }

          return Promise.resolve();
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

    nameMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.name.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.medicine.name.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
    usageMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.usage.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.medicine.usage.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
    featureMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.feature.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.medicine.feature.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
    unitMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.unit.required' }),
      },
    ],
    statusMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.status.required' }),
      },
    ],

    fullName: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.full-name.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.full-name.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
    staffCode: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.staff-code.required' }),
      },
      {
        validator(_: RuleObject, value: string) {
          if (value && value.trimStart() !== value) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.staff-code.space',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
  };
};
