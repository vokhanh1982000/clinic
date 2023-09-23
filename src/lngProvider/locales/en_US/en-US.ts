import antdEN from 'antd/locale/en_US';
import common from './common_en.json';
import signin from './signin.json';
import forgotpassword from './forgot.password.json';
import menu from './menu.json';
import medicine from './medicine.json';
import role from './role.json';
import clinic from './clinic.json';
import manager from './manager.json';

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
  },
  antd: antdEN,
  locale: 'en-US',
};
export default EnLang;
