const ADMIN = '/admin';

export const ADMIN_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
};

export const ADMIN_ROUTE_PATH = {
  DASHBOARD: ADMIN,
  SIGNIN: `${ADMIN}/${ADMIN_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${ADMIN}/${ADMIN_ROUTE_NAME.FORGOT_PASSWORD}`,
};
