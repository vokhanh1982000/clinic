import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_ROUTE_NAME } from '../../constants/route';
import CreateDoctor from './doctor/CreateEditDoctor';
import CreateCustomer from './customer/CreateEditCustomer';
import ChangePasswordAdmin from './auth/ChangePassword';

const Admin = React.lazy(() => import('./index'));
const ListCustomer = React.lazy(() => import('./customer/ListCustomer'));
const ListRole = React.lazy(() => import('./role/ListRole'));
const CreateRole = React.lazy(() => import('./role/CreateEditRole'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));
const ForgotPassAdmin = React.lazy(() => import('./auth/ForgotPassAdmin'));
const ListAdmin = React.lazy(() => import('./adminUser/index'));
const ListBooking = React.lazy(() => import('./booking/index'));
const ListClinic = React.lazy(() => import('./clinic/ListClinic'));
const CreateClinic = React.lazy(() => import('./clinic/CreateEditClinic'));
const ListDoctor = React.lazy(() => import('./doctor/ListDoctor'));
const ListMedicalSpecialty = React.lazy(() => import('./medicalSpecialty/index'));
const ListNews = React.lazy(() => import('./news/ListNew'));
const Statistic = React.lazy(() => import('./statistic/index'));
const CreateAdmin = React.lazy(() => import('./adminUser/CreateEditAdminUser'));
const ListMedicine = React.lazy(() => import('./medicine/index'));
const AdminProfile = React.lazy(() => import('./profile/index'));
export const AdminRoutes = () => (
  <Routes>
    <Route path={ADMIN_ROUTE_NAME.SIGNIN} element={<SignInAdmin />} />
    <Route path={ADMIN_ROUTE_NAME.FORGOT_PASSWORD} element={<ForgotPassAdmin />} />
    <Route path={ADMIN_ROUTE_NAME.DASHBOARD} element={<Admin />}>
      <Route path={ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListAdmin />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateAdmin />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateAdmin />} />} />
      </Route>

      <Route path={ADMIN_ROUTE_NAME.BOOKING_MANAGEMENT} element={<ListBooking />} />
      <Route path={ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListClinic />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateClinic />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateClinic />} />} />
      </Route>
      <Route path={ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListDoctor />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateDoctor />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateDoctor />} />} />
      </Route>
      <Route path={ADMIN_ROUTE_NAME.MEDICAL_SPECIALTY_MANAGEMENT} element={<ListMedicalSpecialty />} />
      <Route path={ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListNews />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateDoctor />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateDoctor />} />} />
      </Route>
      <Route path={ADMIN_ROUTE_NAME.STATISTIC} element={<Statistic />} />
      <Route path={ADMIN_ROUTE_NAME.USER_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListCustomer />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateCustomer />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateCustomer />} />} />
      </Route>
      <Route path={ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListRole />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateRole />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateRole />} />} />
      </Route>
      <Route path={ADMIN_ROUTE_NAME.MEDICINE_MANAGEMENT} element={<ListMedicine />} />
      <Route path={ADMIN_ROUTE_NAME.ADMIN_PROFILE} element={<AdminProfile />} />
      <Route path={ADMIN_ROUTE_NAME.CHANGE_PASSWORD} element={<ChangePasswordAdmin />} />
    </Route>
  </Routes>
);
