import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH, DOCTOR_CLINIC_ROUTE_PATH } from '../constants/route';

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
      default:
        return '';
    }
  } else if (route === 'Doctor') {
    switch (key) {
      case DOCTOR_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'bookingManagementIconActive';
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
      case ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'menu.bookingManagement';
      case ADMIN_ROUTE_PATH.CLINIC_MANAGEMENT:
        return 'menu.clinicManagement';
      case ADMIN_ROUTE_PATH.DOCTOR_MANAGEMENT:
        return 'menu.doctorSupportManagement';
      case ADMIN_ROUTE_PATH.MEDICAL_SPECIALTY_MANAGEMENT:
        return 'menu.medicalSpecialtyManagement';
      case ADMIN_ROUTE_PATH.NEWS_MANAGEMENT:
        return 'menu.newsManagement';
      case ADMIN_ROUTE_PATH.STATISTIC:
        return 'menu.statisticsManagement';
      default:
        return '';
    }
  } else if (route === 'admin-clinic') {
    switch (key) {
      case ADMIN_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'menu.bookingManagement';
      case ADMIN_CLINIC_ROUTE_PATH.MEDICINE_MANAGEMENT:
        return 'menu.medicineManagement';
      case ADMIN_CLINIC_ROUTE_PATH.DOCTOR_MANAGEMENT:
        return 'menu.doctorManagement';
      default:
        return '';
    }
  } else if (route === '') {
    switch (key) {
      case DOCTOR_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT:
        return 'menu.bookingManagement';
      default:
        return '';
    }
  } else return '';
};
