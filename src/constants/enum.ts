export enum ActionUser {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
}

export enum DoctorType {
  DOCTOR = 'doctor',
  DOCTOR_SUPPORT = 'doctor-support',
}

export enum MENU_ITEM_TYPE {
  CATEGORY = 'category',
  LANGUAGE = 'language',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MedicineStatus {
  STILL = 'still',
  NONE_LEFT = 'none-left',
}

export enum MedicineUnit {
  PELLET = 'pellet',
  JAR = 'jar',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum LanguageType {
  VN = 'VN',
  ENG = 'ENG',
}
export enum PERMISSIONS {
  Authenticated = 'Authenticated',
  SuperAdmin = 'SuperAdmin',
  CreateRole = 'CreateRole',
  ReadRole = 'ReadRole',
  UpdateRole = 'UpdateRole',
  DeleteRole = 'DeleteRole',
  CreateCustomer = 'CreateCustomer',
  ReadCustomer = 'ReadCustomer',
  UpdateCustomer = 'UpdateCustomer',
  DeleteCustomer = 'DeleteCustomer',
  CreateAdministrator = 'CreateAdministrator',
  ReadAdministrator = 'ReadAdministrator',
  UpdateAdministrator = 'UpdateAdministrator',
  DeleteAdministrator = 'DeleteAdministrator',
  CreateAdministratorClinic = 'CreateAdministratorClinic',
  ReadAdministratorClinic = 'ReadAdministratorClinic',
  UpdateAdministratorClinic = 'UpdateAdministratorClinic',
  DeleteAdministratorClinic = 'DeleteAdministratorClinic',
  CreateDoctorClinic = 'CreateDoctorClinic',
  ReadDoctorClinic = 'ReadDoctorClinic',
  UpdateDoctorClinic = 'UpdateDoctorClinic',
  DeleteDoctorClinic = 'DeleteDoctorClinic',
  CreateDoctorSuppot = 'CreateDoctorSuppot',
  ReadDoctorSuppot = 'ReadDoctorSuppot',
  UpdateDoctorSuppot = 'UpdateDoctorSuppot',
  DeleteDoctorSuppot = 'DeleteDoctorSuppot',
  CreateCaregory = 'CreateCaregory',
  ReadCaregory = 'ReadCaregory',
  UpdateCaregory = 'UpdateCaregory',
  DeleteCaregory = 'DeleteCaregory',
  CreateClinic = 'CreateClinic',
  ReadClinic = 'ReadClinic',
  UpdateClinic = 'UpdateClinic',
  DeleteClinic = 'DeleteClinic',
  CreateBooking = 'CreateBooking',
  ReadBooking = 'ReadBooking',
  UpdateBooking = 'UpdateBooking',
  DeleteBooking = 'DeleteBooking',
  CreateMedicine = 'CreateMedicine',
  ReadMedicine = 'ReadMedicine',
  UpdateMedicine = 'UpdateMedicine',
  DeleteMedicine = 'DeleteMedicine',
  CreateNew = 'CreateNew',
  ReadNew = 'ReadNew',
  UpdateNew = 'UpdateNew',
  DeleteNew = 'DeleteNew',
  CreateLanguage = 'CreateLanguage',
  ReadLanguage = 'ReadLanguage',
  UpdateLanguage = 'UpdateLanguage',
  DeleteLanguage = 'DeleteLanguage',
}

export enum UserType {
  ADMIN = 'administrator',
  CUSTOMER = 'customer',
  ADMINCLINIC = 'administrator_clinic',
  DOCTORCLINIC = 'doctor_clinic',
  DOCTORSUPPORT = 'doctor_support',
}
