import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_CLINIC_ROUTE_NAME } from '../../constants/route';
import AdminClinicProfile from './profile';

const AdminClinic = React.lazy(() => import('.'));
const SignIn = React.lazy(() => import('./auth/SignIn'));
const ListBooking = React.lazy(() => import('./booking/index'));
const ListMedicine = React.lazy(() => import('./medicine/index'));
const ListDoctor = React.lazy(() => import('./doctor/index'));
export const AdminClinicRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SuspenseWrapper component={<SignIn />} />} />
    <Route path="" element={<SuspenseWrapper component={<AdminClinic />} />}>
      <Route path={ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT} element={<ListBooking />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.MEDICINE_MANAGEMENT} element={<ListMedicine />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT} element={<ListDoctor />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.ADMIN_CLINIC_PROFILE} element={<AdminClinicProfile />} />
    </Route>
  </Routes>
);
