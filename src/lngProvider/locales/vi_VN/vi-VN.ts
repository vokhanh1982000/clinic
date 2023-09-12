import antdVI from 'antd/locale/vi_VN';
import common from './common_vi.json';
import signin from './signin.json';
import forgot from './forgot.password.json';

const viLang = {
  messages: {
    ...common,
    ...signin,
    ...forgot,
  },
  antd: antdVI,
  locale: 'vi-VN',
};
export default viLang;
