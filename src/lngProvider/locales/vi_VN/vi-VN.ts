import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import forgot from './forgot.password.json';
import menu from './menu.json';
import medicine from './medicine.json';
import role from './role.json';
import clinic from './clinic.json';
import manager from './manager.json';
import adminuser from './admin.user.json';
import doctor from './doctor.json';
import category from './category.json';
import adminProfile from './admin.profile.json';
import customer from './customer.json';
import doctorProfile from './doctor.profile.json';
import adminClinic from './admin.clinic.profile.json';
import changePassword from './change-password.json';

const viLang = {
  messages: {
    ...common,
    ...signin,
    ...forgot,
    ...menu,
    ...medicine,
    ...role,
    ...clinic,
    ...manager,
    ...adminuser,
    ...doctor,
    ...category,
    ...adminProfile,
    ...customer,
    ...doctorProfile,
    ...adminClinic,
    ...changePassword,
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
