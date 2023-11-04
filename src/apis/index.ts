import axios from 'axios';
import { logOut } from '../util/logout';
import {
  AuthApi,
  CustomersApi,
  Configuration,
  RolesApi,
  PermissionsApi,
  AdminApi,
  CategoryApi,
  MedicineApi,
  AdminMedicineApi,
  CadastralApi,
  ClinicsApi,
  DoctorClinicApi,
  AdministratorClinicApi,
  AssetsApi,
  DoctorSupportApi,
  NewsApi,
  DoctorClinicBookingApi,
  LanguageApi,
  HolidayScheduleApi,
  AdminClinicBookingApi,
  AdminBookingApi,
  PrescriptionSampleApi,
  PrescriptionSampleMedicineApi,
} from './client-axios';

const config = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
  accessToken: localStorage.getItem('token') || undefined,
});
export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      // logOut();
    }
    return Promise.reject(error);
  }
);

const authApi = new AuthApi(config, undefined, axiosInstance);
const customerApi = new CustomersApi(config, undefined, axiosInstance);
const roleApi = new RolesApi(config, undefined, axiosInstance);
const permissionApi = new PermissionsApi(config, undefined, axiosInstance);
const adminApi = new AdminApi(config, undefined, axiosInstance);
const categoryApi = new CategoryApi(config, undefined, axiosInstance);
const medicineApi: MedicineApi = new MedicineApi(config, undefined, axiosInstance);
const adminMedicineApi: AdminMedicineApi = new AdminMedicineApi(config, undefined, axiosInstance);
const cadastralApi: CadastralApi = new CadastralApi(config, undefined, axiosInstance);
const clinicsApi: ClinicsApi = new ClinicsApi(config, undefined, axiosInstance);
const doctorClinicApi: DoctorClinicApi = new DoctorClinicApi(config, undefined, axiosInstance);
const doctorClinicBookingApi: DoctorClinicBookingApi = new DoctorClinicBookingApi(config, undefined, axiosInstance);
const adminClinicBookingApi: AdminClinicBookingApi = new AdminClinicBookingApi(config, undefined, axiosInstance);
const adminClinicApi = new AdministratorClinicApi(config, undefined, axiosInstance);
const adminBookingApi: AdminBookingApi = new AdminBookingApi(config, undefined, axiosInstance);
const assetsApi = new AssetsApi(config, undefined, axiosInstance);
const doctorSupportApi = new DoctorSupportApi(config, undefined, axiosInstance);
const newsApi = new NewsApi(config, undefined, axiosInstance);
const languageApi = new LanguageApi(config, undefined, axiosInstance);
const holidayScheduleApi: HolidayScheduleApi = new HolidayScheduleApi(config, undefined, axiosInstance);
const samplePrescriptionApi: PrescriptionSampleApi = new PrescriptionSampleApi(config, undefined, axiosInstance);
const samplePrescriptionMediceApi: PrescriptionSampleMedicineApi = new PrescriptionSampleMedicineApi(
  config,
  undefined,
  axiosInstance
);
export {
  authApi,
  customerApi,
  roleApi,
  permissionApi,
  adminApi,
  categoryApi,
  medicineApi,
  adminMedicineApi,
  cadastralApi,
  clinicsApi,
  adminClinicApi,
  adminBookingApi,
  doctorClinicApi,
  doctorClinicBookingApi,
  adminClinicBookingApi,
  assetsApi,
  doctorSupportApi,
  newsApi,
  languageApi,
  holidayScheduleApi,
  samplePrescriptionApi,
  samplePrescriptionMediceApi,
};
