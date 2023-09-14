import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_ROUTE_NAME } from '../../constants/route';

const Admin = React.lazy(() => import('./index'));
const ListCustomer = React.lazy(() => import('./customer/ListCustomer'));
const ListRole = React.lazy(() => import('./role/ListRole'));
const CreateRole = React.lazy(() => import('./role/CreateEditRole'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));
const ForgotPassAdmin = React.lazy(() => import('./auth/ForgotPassAdmin'));
const ListAdmin = React.lazy(() => import('./adminUser/index'));
const ListBooking = React.lazy(() => import('./booking/index'));
const ListClinic = React.lazy(() => import('./clinic/index'));
const ListDoctor = React.lazy(() => import('./doctor/index'));
const ListMedicalSpecialty = React.lazy(() => import('./medicalSpecialty/index'));
const ListNews = React.lazy(() => import('./news/index'));
const Statistic = React.lazy(() => import('./statistic/index'));

export const AdminRoutes = () => (
  <Routes>
    <Route path={ADMIN_ROUTE_NAME.SIGNIN} element={<SignInAdmin />} />
    <Route path={ADMIN_ROUTE_NAME.FORGOT_PASSWORD} element={<ForgotPassAdmin />} />
    <Route path={ADMIN_ROUTE_NAME.DASHBOARD} element={<Admin />}>
      <Route path={ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT} element={<ListAdmin />} />
      <Route path={ADMIN_ROUTE_NAME.BOOKING_MANAGEMENT} element={<ListBooking />} />
      <Route path={ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT} element={<ListClinic />} />
      <Route path={ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT} element={<ListDoctor />} />
      <Route path={ADMIN_ROUTE_NAME.MEDICAL_SPECIALTY_MANAGEMENT} element={<ListMedicalSpecialty />} />
      <Route path={ADMIN_ROUTE_NAME.NEWS_MANAGEMENT} element={<ListNews />} />
      <Route path={ADMIN_ROUTE_NAME.STATISTIC} element={<Statistic />} />
      <Route path={ADMIN_ROUTE_NAME.USER_MANAGEMENT} element={<ListCustomer />} />
      <Route path={ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListRole />} />} />
        <Route path={ADMIN_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateRole />} />} />
        <Route path={`${ADMIN_ROUTE_NAME.DETAIL}/:id`} element={<SuspenseWrapper component={<CreateRole />} />} />
      </Route>
    </Route>
  </Routes>
);
