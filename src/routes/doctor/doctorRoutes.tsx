import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { DOCTOR_CLINIC_ROUTE_NAME } from '../../constants/route';
import DoctorProfile from './profile';
import ChangePasswordDoctorClinic from './auth/ChangePassword';
import ListPrescriptionTeamplate from './prescription-teamplate/list';
import CreateUpdatePrescriptionTeamplate from './prescription-teamplate/create-update';

const Doctor = React.lazy(() => import('.'));
const SignInDoctor = React.lazy(() => import('./auth/SignInDoctor'));
const ForgotPassDoctor = React.lazy(() => import('./auth/ForgotPassDoctor'));
const ListBooking = React.lazy(() => import('./booking/index'));
const CreateOrUpDateBooking = React.lazy(() => import('./booking/CreateOrUpdate'));

export const DoctorRoutes = () => (
  <Routes>
    <Route path={DOCTOR_CLINIC_ROUTE_NAME.SIGNIN} element={<SuspenseWrapper component={<SignInDoctor />} />} />
    <Route path={DOCTOR_CLINIC_ROUTE_NAME.FORGOT_PASSWORD} element={<ForgotPassDoctor />} />
    <Route path="" element={<SuspenseWrapper component={<Doctor />} />}>
      <Route path={DOCTOR_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}>
        <Route path={''} element={<ListBooking />} />
        <Route path={DOCTOR_CLINIC_ROUTE_NAME.CREATE} element={<CreateOrUpDateBooking />} />
        <Route path={`${DOCTOR_CLINIC_ROUTE_NAME.DETAIL}/:id`} element={<CreateOrUpDateBooking />} />
      </Route>
      <Route path={DOCTOR_CLINIC_ROUTE_NAME.DOCTOR_PROFILE} element={<DoctorProfile />} />
      <Route path={DOCTOR_CLINIC_ROUTE_NAME.CHANGE_PASSWORD} element={<ChangePasswordDoctorClinic />} />
      <Route path={DOCTOR_CLINIC_ROUTE_NAME.PRESCRIPTION_TEAMPLATE}>
        <Route path="" element={<SuspenseWrapper component={<ListPrescriptionTeamplate />} />} />
        <Route
          path={DOCTOR_CLINIC_ROUTE_NAME.CREATE}
          element={<SuspenseWrapper component={<CreateUpdatePrescriptionTeamplate />} />}
        />
        <Route
          path={`${DOCTOR_CLINIC_ROUTE_NAME.DETAIL}/:id`}
          element={<SuspenseWrapper component={<CreateUpdatePrescriptionTeamplate />} />}
        />
      </Route>
    </Route>
  </Routes>
);
