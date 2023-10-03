import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { DOCTOR_CLINIC_ROUTE_NAME } from '../../constants/route';
import DoctorProfile from './profile';

const Doctor = React.lazy(() => import('.'));
const SignInDoctor = React.lazy(() => import('./auth/SignInDoctor'));
const ListBooking = React.lazy(() => import('./booking/index'));

export const DoctorRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SuspenseWrapper component={<SignInDoctor />} />} />
    <Route path="" element={<SuspenseWrapper component={<Doctor />} />}>
      <Route path={DOCTOR_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT} element={<ListBooking />} />
      <Route path={DOCTOR_CLINIC_ROUTE_NAME.DOCTOR_PROFILE} element={<DoctorProfile />} />
    </Route>
  </Routes>
);
