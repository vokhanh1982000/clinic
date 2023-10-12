import antdEN from 'antd/locale/en_US';
import common from './common_en.json';
import signin from './signin.json';
import forgotpassword from './forgot.password.json';
import menu from './menu.json';
import medicine from './medicine.json';
import role from './role.json';
import clinic from './clinic.json';
import manager from './manager.json';
import adminuser from './admin.user.json';
import doctor from './doctor.json';
import category from './category.json';
import customer from './customer.json';
import adminProfile from './admin.profile.json';
import doctorProfile from './doctor.profile.json';
import adminClinicProfile from './admin.clinic.profile.json';
import setting from './setting.json';
import changePassword from './change-password.json';
import validate from './validate.json';
import news from './new.json';

const EnLang = {
  messages: {
    ...common,
    ...signin,
    ...forgotpassword,
    ...menu,
    ...medicine,
    ...role,
    ...clinic,
    ...manager,
    ...adminuser,
    ...doctor,
    ...category,
    ...customer,
    ...adminProfile,
    ...adminClinicProfile,
    ...doctorProfile,
    ...setting,
    ...changePassword,
    ...news,
    ...validate,
  },
  antd: antdEN,
  locale: 'en-US',
};
export default EnLang;
