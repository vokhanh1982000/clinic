const ADMIN = '/admin';
const ADMIN_CLINIC = '/admin-clinic';
const DOCTOR_CLINIC = '';

const ACTION = {
  CREATE: 'create',
  DETAIL: 'detail',
};

export const ADMIN_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  ROLE_MANAGEMENT: 'role-management',
  USER_MANAGEMENT: 'user-management',
  ADMIN_MANAGEMENT: 'admin-management',
  BOOKING_MANAGEMENT: 'booking-management',
  CLINIC_MANAGEMENT: 'clinic-management',
  DOCTOR_MANAGEMENT: 'doctor-management',
  MEDICAL_SPECIALTY_MANAGEMENT: 'medical-specialty-management',
  NEWS_MANAGEMENT: 'news-management',
  STATISTIC: 'statistic',

  CREATE: 'create',
  DETAIL: 'detail',
};

export const ADMIN_ROUTE_PATH = {
  DASHBOARD: `${ADMIN}/${ADMIN_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${ADMIN}/${ADMIN_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${ADMIN}/${ADMIN_ROUTE_NAME.FORGOT_PASSWORD}`,

  ROLE_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`,
  CREATE_ROLE: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_ROLE: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}/${ACTION.DETAIL}`,

  USER_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`,
  ADMIN_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`,
  CREATE_ADMIN: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_ADMIN: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}/${ACTION.DETAIL}`,

  BOOKING_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.BOOKING_MANAGEMENT}`,

  CLINIC_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}`,
  CREATE_CLINIC: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_CLINIC: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}/${ACTION.DETAIL}`,

  DOCTOR_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT}`,
  MEDICAL_SPECIALTY_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.MEDICAL_SPECIALTY_MANAGEMENT}`,
  NEWS_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`,
  STATISTIC: `${ADMIN}/${ADMIN_ROUTE_NAME.STATISTIC}`,
};

export const ADMIN_CLINIC_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  BOOKING_MANAGEMENT: 'booking-management',
  MEDICINE_MANAGEMENT: 'medicine-management',
  DOCTOR_MANAGEMENT: 'doctor-management',

  CREATE: 'create',
  DETAIL: 'detail',
};

export const ADMIN_CLINIC_ROUTE_PATH = {
  DASHBOARD: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.FORGOT_PASSWORD}`,
  BOOKING_MANAGEMENT: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}`,
  MEDICINE_MANAGEMENT: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.MEDICINE_MANAGEMENT}`,
  DOCTOR_MANAGEMENT: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}`,
};

export const DOCTOR_CLINIC_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  BOOKING_MANAGEMENT: 'booking-management',

  CREATE: 'create',
  DETAIL: 'detail',
};

export const DOCTOR_CLINIC_ROUTE_PATH = {
  DASHBOARD: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.FORGOT_PASSWORD}`,
  BOOKING_MANAGEMENT: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}`,
};
