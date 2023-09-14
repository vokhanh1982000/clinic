import { ADMIN_ROUTE_PATH } from '../constants/route';

export const getMenuActiveIconName = (key: string): string => {
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
};

export const getLabelBreadcrum = (key: string): string => {
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
      return 'menu.doctorManagement';
    case ADMIN_ROUTE_PATH.MEDICAL_SPECIALTY_MANAGEMENT:
      return 'menu.medicalSpecialtyManagement';
    case ADMIN_ROUTE_PATH.NEWS_MANAGEMENT:
      return 'menu.newsManagement';
    case ADMIN_ROUTE_PATH.STATISTIC:
      return 'menu.statisticsManagement';
    default:
      return '';
  }
};
