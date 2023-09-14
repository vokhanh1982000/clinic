import antdEN from 'antd/locale/en_US';
import common from './common_en.json';
import signin from './signin.json';
import forgotpassword from './forgot.password.json';
import menu from './menu.json';

const EnLang = {
  messages: {
    ...common,
    ...signin,
    ...forgotpassword,
    ...menu,
  },
  antd: antdEN,
  locale: 'en-US',
};
export default EnLang;
