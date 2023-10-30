import { Rule, RuleObject } from 'antd/lib/form';
import { IntlShape } from 'react-intl';
import { validator } from './validator.validate';
interface Validate {
  [key: string]: Rule[];
}

const REGEX_URL = '';
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
        message: intl.formatMessage({ id: 'validate.required.password' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required.password',
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
            id: 'validate.phone.required',
          }),
          phone: intl.formatMessage({
            id: 'validate.phone',
          }),
        }),
      },
    ],
    phoneClinic: [
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
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required',
          }),
        }),
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
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required.category-name',
          }),
        }),
      },
    ],
    nameCustomer: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.customer-name' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required.customer-name',
          }),
        }),
      },
    ],
    nameDoctor: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.doctor-name' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required.doctor-name',
          }),
        }),
      },
    ],
    nameClinic: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.clinic-name' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required.clinic-name',
          }),
        }),
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
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.required' }),
      // },
      {
        validator: validator({
          min4: intl.formatMessage({
            id: 'validate.min_4_char',
          }),
        }),
      },
    ],
    customerCode: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.customer-code.required' }),
      // },
      {
        validator: validator({
          min4: intl.formatMessage({
            id: 'validate.min_4_char',
          }),
        }),
      },
    ],
    clinicCode: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.required.clinic-code' }),
      // },
      {
        validator: validator({
          min4: intl.formatMessage({
            id: 'validate.min_4_char',
          }),
        }),
      },
    ],
    space: [
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.required.clinic-name',
          }),
        }),
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
        message: intl.formatMessage({ id: 'validate.full-name.required' }),
      },
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
      // {
      //   validator(_: RuleObject, value: string) {
      //     const regex = new RegExp(START_SPACE);
      //     if (regex.test(value)) {
      //       return Promise.resolve();
      //     }
      //     return Promise.reject(
      //       intl.formatMessage({
      //         id: 'validate.full-name.required',
      //       })
      //     );
      //   },
      // },
    ],
    languageName: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.language.required' }),
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
      // {
      //   validator(_: RuleObject, value: string) {
      //     const regex = new RegExp(START_SPACE);
      //     if (regex.test(value)) {
      //       return Promise.resolve();
      //     }
      //     return Promise.reject(
      //       intl.formatMessage({
      //         id: 'validate.language.required',
      //       })
      //     );
      //   },
      // },
    ],
    code: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.staff-code.required' }),
      // },
      {
        validator: validator({
          min4: intl.formatMessage({
            id: 'validate.min_4_char',
          }),
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
      // {
      //   validator(_: RuleObject, value: string) {
      //     const regex = new RegExp(START_SPACE);
      //     if (regex.test(value)) {
      //       return Promise.resolve();
      //     }
      //     return Promise.reject(
      //       intl.formatMessage({
      //         id: 'validate.space',
      //       })
      //     );
      //   },
      // },
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
      // {
      //   validator(_: RuleObject, value: string) {
      //     const regex = new RegExp(START_SPACE);
      //     if (regex.test(value)) {
      //       return Promise.resolve();
      //     }
      //     return Promise.reject(
      //       intl.formatMessage({
      //         id: 'validate.space',
      //       })
      //     );
      //   },
      // },
    ],
    specialist: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.specialist' }),
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
      // {
      //   validator(_: RuleObject, value: string) {
      //     const regex = new RegExp(START_SPACE);
      //     if (regex.test(value)) {
      //       return Promise.resolve();
      //     }
      //     return Promise.reject(
      //       intl.formatMessage({
      //         id: 'validate.space',
      //       })
      //     );
      //   },
      // },
    ],
    passwordCustom: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.required.password' }),
      },
      {
        validator: validator({
          password: intl.formatMessage({ id: 'validate.password' }),
        }),
      },
    ],
    realNumber: [
      {
        validator(_: RuleObject, value: number) {
          if (value && value < 1) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.number',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
    nameMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.name.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.medicine.name.required',
          }),
        }),
      },
    ],
    usageMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.usage.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.medicine.usage.required',
          }),
        }),
      },
    ],
    featureMedicine: [
      {
        required: true,
        message: intl.formatMessage({ id: 'validate.medicine.feature.required' }),
      },
      {
        validator: validator({
          space: intl.formatMessage({
            id: 'validate.medicine.feature.required',
          }),
        }),
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

    // fullName: [
    //   {
    //     required: true,
    //     message: intl.formatMessage({ id: 'validate.full-name.required' }),
    //   },
    //   {
    //     validator(_: RuleObject, value: string) {
    //       if (value && value.trimStart() !== value) {
    //         return Promise.reject(
    //           intl.formatMessage({
    //             id: 'validate.full-name.space',
    //           })
    //         );
    //       }
    //       return Promise.resolve();
    //     },
    //   },
    // ],
    staffCode: [
      // {
      //   required: true,
      //   message: intl.formatMessage({ id: 'validate.staff-code.required' }),
      // },
      {
        validator: validator({
          space: intl.formatMessage({ id: 'validate.staff-code.required' }),
        }),
      },
    ],
    statusPrescription: [
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
    ],
    usesPrescription: [
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
    ],
    notePrescription: [
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
    ],
    guidePrescription: [
      {
        validator: validator({
          normal: intl.formatMessage({ id: 'common.noti.special' }),
        }),
      },
    ],
    guideMedicine: [
      {
        validator: validator({
          normalLess: intl.formatMessage({ id: 'validate.medicine.normal' }),
        }),
      },
    ],
    quantityMedicine: [
      {
        validator(_: RuleObject, value: number) {
          if (value && value < 1) {
            return Promise.reject(
              intl.formatMessage({
                id: 'validate.medicine.quantity',
              })
            );
          }
          return Promise.resolve();
        },
      },
    ],
  };
};
