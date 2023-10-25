const ADMIN = '/admin';
const ADMIN_CLINIC = '/admin-clinic';
const DOCTOR_CLINIC = '';

const ACTION = {
  CREATE: 'create',
  DETAIL: 'detail',
  SCHEDULE: 'schedule',
  BOOKING_EMPTY: 'empty',
  CLINIC: 'clinic',
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
  MEDICINE_MANAGEMENT: 'medicine-management',
  ADMIN_PROFILE: 'admin-profile',
  CHANGE_PASSWORD: 'change-password',
  LANGUAGE_MANAGEMENT: 'language-management',

  CREATE: 'create',
  DETAIL: 'detail',
  DOCTOR_DETAIL: 'doctor-detail',
  CLINIC: 'clinic',
  SCHEDULE: 'schedule',
};

export const ADMIN_ROUTE_PATH = {
  DASHBOARD: `${ADMIN}/${ADMIN_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${ADMIN}/${ADMIN_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${ADMIN}/${ADMIN_ROUTE_NAME.FORGOT_PASSWORD}`,

  ROLE_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`,
  CREATE_ROLE: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_ROLE: `${ADMIN}/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}/${ACTION.DETAIL}`,

  USER_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`,
  CREATE_USER: `${ADMIN}/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_USER: `${ADMIN}/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}/${ACTION.DETAIL}`,

  ADMIN_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`,
  CREATE_ADMIN: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_ADMIN: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}/${ACTION.DETAIL}`,

  BOOKING_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.BOOKING_MANAGEMENT}`,
  CLINIC_BOOKING_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.BOOKING_MANAGEMENT}/${ACTION.CLINIC}`,
  SCHEDULE_DOCTOR: `${ADMIN}/${ADMIN_ROUTE_NAME.BOOKING_MANAGEMENT}/${ACTION.SCHEDULE}`,

  CLINIC_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}`,
  CREATE_CLINIC: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_CLINIC: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}/${ACTION.DETAIL}`,
  DETAIL_DOCTOR_CLINIC: `${ADMIN}/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}/${ADMIN_ROUTE_NAME.DOCTOR_DETAIL}`,

  DOCTOR_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT}`,
  CREATE_DOCTOR: `${ADMIN}/${ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_DOCTOR: `${ADMIN}/${ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT}/${ACTION.DETAIL}`,

  MEDICAL_SPECIALTY_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.MEDICAL_SPECIALTY_MANAGEMENT}`,

  LANGUAGE_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.LANGUAGE_MANAGEMENT}`,

  NEWS_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`,
  CREATE_NEW: `${ADMIN}/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_NEW: `${ADMIN}/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}/${ACTION.DETAIL}`,

  STATISTIC: `${ADMIN}/${ADMIN_ROUTE_NAME.STATISTIC}`,
  MEDICINE_MANAGEMENT: `${ADMIN}/${ADMIN_ROUTE_NAME.MEDICINE_MANAGEMENT}`,
  ADMIN_PROFILE: `${ADMIN}/${ADMIN_ROUTE_NAME.ADMIN_PROFILE}`,
  CHANGE_PASSWORD: `${ADMIN}/${ADMIN_ROUTE_NAME.CHANGE_PASSWORD}`,
};

export const ADMIN_CLINIC_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  BOOKING_MANAGEMENT: 'booking-management',
  MEDICINE_MANAGEMENT: 'medicine-management',
  DOCTOR_MANAGEMENT: 'doctor-management',
  SETTING: 'setting',
  ADMIN_CLINIC_PROFILE: 'admin-clinic-profile',
  CHANGE_PASSWORD: 'change-password',
  CREATE: 'create',
  DETAIL: 'detail',
  SCHEDULE: 'schedule',
  BOOKING_EMPTY: 'empty',
};

export const ADMIN_CLINIC_ROUTE_PATH = {
  DASHBOARD: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.FORGOT_PASSWORD}`,
  BOOKING_MANAGEMENT: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}`,
  BOOKING_MANAGEMENT_EMPTY: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}/${ACTION.BOOKING_EMPTY}`,
  MEDICINE_MANAGEMENT: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.MEDICINE_MANAGEMENT}`,
  DOCTOR_MANAGEMENT: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}`,
  SETTING: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.SETTING}`,
  ADMIN_CLINIC_PROFILE: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.ADMIN_CLINIC_PROFILE}`,
  CHANGE_PASSWORD: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.CHANGE_PASSWORD}`,
  CREATE_DOCTOR: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}/${ACTION.CREATE}`,
  DETAIL_DOCTOR: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}/${ACTION.DETAIL}`,
  DETAIL_BOOKING: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}/${ACTION.DETAIL}`,
  CREATE_BOOKING: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}/${ACTION.CREATE}`,
  SCHEDULE_DOCTOR: `${ADMIN_CLINIC}/${ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}/${ACTION.SCHEDULE}`,
};

export const DOCTOR_CLINIC_ROUTE_NAME = {
  DASHBOARD: '',
  SIGNIN: 'signin',
  FORGOT_PASSWORD: 'forgot-password',
  BOOKING_MANAGEMENT: 'booking-management',
  DOCTOR_PROFILE: 'doctor-profile',
  CHANGE_PASSWORD: 'change-password',

  CREATE: 'create',
  DETAIL: 'detail',
};

export const DOCTOR_CLINIC_ROUTE_PATH = {
  DASHBOARD: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.DASHBOARD}`,
  SIGNIN: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.SIGNIN}`,
  FORGOT_PASSWORD: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.FORGOT_PASSWORD}`,
  BOOKING_MANAGEMENT: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}`,
  DOCTOR_PROFILE: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.DOCTOR_PROFILE}`,
  CHANGE_PASSWORD: `${DOCTOR_CLINIC}/${DOCTOR_CLINIC_ROUTE_NAME.CHANGE_PASSWORD}`,
};
