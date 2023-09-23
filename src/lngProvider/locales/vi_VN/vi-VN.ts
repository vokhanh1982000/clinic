import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import forgot from './forgot.password.json';
import menu from './menu.json';
import medicine from './medicine.json';
import role from './role.json';
import clinic from './clinic.json';
import manager from './manager.json';

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
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
