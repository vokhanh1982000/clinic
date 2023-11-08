import {
  ADMIN_CLINIC_ROUTE_NAME,
  ADMIN_CLINIC_ROUTE_PATH,
  ADMIN_ROUTE_PATH,
  DOCTOR_CLINIC_ROUTE_PATH,
} from '../constants/route';

export const getMenuActiveIconName = (key: string, route: 'Admin' | 'AdminClinic' | 'Doctor'): string => {
  if (route === 'Admin') {
    switch (key) {
      case ADMIN_ROUTE_PATH.ROLE_MANAGEMENT:
        return 'roleManagementIconActive';
      case ADMIN_ROUTE_PATH.USER_MANAGEMENT:
        return 'userManagementIconActive';
      case ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT:
        return 'adminManagementIconActive';
      case ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'bookingManagementIconActive';
      case ADMIN_ROUTE_PATH.CLINIC_MANAGEMENT:
        return 'clinicManagementIconActive';
      case ADMIN_ROUTE_PATH.DOCTOR_MANAGEMENT:
        return 'doctorManagementIconActive';
      case ADMIN_ROUTE_PATH.MEDICAL_SPECIALTY_MANAGEMENT:
        return 'medicalSpecialtyManagementIconActive';
      case ADMIN_ROUTE_PATH.NEWS_MANAGEMENT:
        return 'newsManagementIconActive';
      case ADMIN_ROUTE_PATH.STATISTIC:
        return 'statisticsManagementIconActive';
      case ADMIN_ROUTE_PATH.MEDICINE_MANAGEMENT:
        return 'medicineManagementIconActive';
      case ADMIN_ROUTE_PATH.LANGUAGE_MANAGEMENT:
        return 'languageManagementActive';
      default:
        return '';
    }
  } else if (route === 'AdminClinic') {
    switch (key) {
      case ADMIN_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'bookingManagementIconActive';
      case ADMIN_CLINIC_ROUTE_PATH.MEDICINE_MANAGEMENT:
        return 'medicineManagementIconActive';
      case ADMIN_CLINIC_ROUTE_PATH.DOCTOR_MANAGEMENT:
        return 'doctorManagementIconActive';
      case ADMIN_CLINIC_ROUTE_PATH.SETTING:
        return 'settingIconActive';
      default:
        return '';
    }
  } else if (route === 'Doctor') {
    switch (key) {
      case DOCTOR_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'bookingManagementIconActive';
      case DOCTOR_CLINIC_ROUTE_PATH.PRESCRIPTION_TEAMPLATE:
        return 'prescriptionTeamplateActive';
      default:
        return '';
    }
  } else return '';
};

export const getLabelBreadcrum = (key: string, route: 'admin' | 'admin-clinic' | ''): string => {
  if (route === 'admin') {
    switch (key) {
      case ADMIN_ROUTE_PATH.ROLE_MANAGEMENT:
        return 'menu.roleManagement';
      case ADMIN_ROUTE_PATH.CREATE_ROLE:
        return 'menu.createRole';
      case ADMIN_ROUTE_PATH.DETAIL_ROLE:
        return 'menu.detailRole';
      case ADMIN_ROUTE_PATH.USER_MANAGEMENT:
        return 'menu.userManagement';
      case ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT:
        return 'menu.adminManagement';
      case ADMIN_ROUTE_PATH.CREATE_ADMIN:
        return 'admin.user.label.create';
      case ADMIN_ROUTE_PATH.DETAIL_ADMIN:
        return 'admin.user.create';
      case ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'menu.bookingManagement';
      case ADMIN_ROUTE_PATH.CLINIC_BOOKING_MANAGEMENT:
        return 'menu.clinicBookingManagement';
      case ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR:
        return 'menu.schedule.doctor';
      case ADMIN_ROUTE_PATH.CLINIC_MANAGEMENT:
        return 'menu.clinicManagement';
      case ADMIN_ROUTE_PATH.CREATE_CLINIC:
        return 'menu.createClinic';
      case ADMIN_ROUTE_PATH.DETAIL_CLINIC:
        return 'menu.detailClinic';
      case ADMIN_ROUTE_PATH.DOCTOR_MANAGEMENT:
        return 'menu.doctorSupportManagement';
      case ADMIN_ROUTE_PATH.MEDICAL_SPECIALTY_MANAGEMENT:
        return 'menu.medicalSpecialtyManagement';
      case ADMIN_ROUTE_PATH.LANGUAGE_MANAGEMENT:
        return 'menu.languageManagement';
      case ADMIN_ROUTE_PATH.NEWS_MANAGEMENT:
        return 'menu.newsManagement';
      case ADMIN_ROUTE_PATH.STATISTIC:
        return 'menu.statisticsManagement';
      case ADMIN_ROUTE_PATH.ADMIN_PROFILE:
        return 'menu.admin-profile';
      case ADMIN_ROUTE_PATH.DETAIL_BOOKING:
        return 'menu.detail-booking';
      case ADMIN_ROUTE_PATH.CREATE_BOOKING:
        return 'menu.create-booking';
      default:
        return '';
    }
  } else if (route === 'admin-clinic') {
    switch (key) {
      case ADMIN_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'menu.bookingManagement';
      case ADMIN_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT_EMPTY:
        return 'menu.bookingManagement.empty';
      case ADMIN_CLINIC_ROUTE_PATH.MEDICINE_MANAGEMENT:
        return 'menu.medicineManagement';
      case ADMIN_CLINIC_ROUTE_PATH.DOCTOR_MANAGEMENT:
        return 'menu.doctorManagement';
      case ADMIN_CLINIC_ROUTE_PATH.CREATE_DOCTOR:
        return 'menu.create.doctor';
      case ADMIN_CLINIC_ROUTE_PATH.DETAIL_DOCTOR:
        return 'menu.detail.doctor';
      case ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR:
        return 'menu.schedule.doctor';
      case ADMIN_CLINIC_ROUTE_PATH.ADMIN_CLINIC_PROFILE:
        return 'menu.admin-clinic-profile';
      case ADMIN_CLINIC_ROUTE_PATH.DETAIL_BOOKING:
        return 'menu.detail-booking';
      case ADMIN_CLINIC_ROUTE_PATH.CREATE_BOOKING:
        return 'menu.create-booking';
      default:
        return '';
    }
  } else if (route === '') {
    switch (key) {
      case DOCTOR_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'menu.bookingManagement';
      case DOCTOR_CLINIC_ROUTE_PATH.DOCTOR_PROFILE:
        return 'menu.doctor-clinic-profile';
      case DOCTOR_CLINIC_ROUTE_PATH.DETAIL_BOOKING:
        return 'menu.detail-booking';
      case DOCTOR_CLINIC_ROUTE_PATH.PRESCRIPTION_TEAMPLATE:
        return 'menu.prescriptonManagent';
      case DOCTOR_CLINIC_ROUTE_PATH.CREATE_PRESCRIPTION_TEAMPLATE:
        return 'menu.prescriptonManagent.create';
      case DOCTOR_CLINIC_ROUTE_PATH.DETAIL_PRESCRIPTION_TEAMPLATE:
        return 'menu.prescriptonManagent.detail';
      default:
        return '';
    }
  } else return '';
};
