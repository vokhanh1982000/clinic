const ADMIN = '/admin';

export const ADMIN_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
};

export const ADMIN_ROUTE_PATH = {
  DASHBOARD: ADMIN,
  SIGNIN: `${ADMIN}/${ADMIN_ROUTE_NAME.SIGNIN}`,
};
