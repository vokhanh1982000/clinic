import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_CLINIC_ROUTE_NAME } from '../../constants/route';
import AdminClinicProfile from './profile';
import ChangePasswordAdminClinic from './auth/ChangePassword';
import CreateDoctor from './doctor/createOrUpdate';
import CreateOrUpDateBooking from './booking/CreateOrUpdate';
import DoctorSchedule from './doctor/Schedule';
import ListBookingEmpty from './booking/Empty';

const AdminClinic = React.lazy(() => import('.'));
const SignIn = React.lazy(() => import('./auth/SignIn'));
const ForgotPassAdmin = React.lazy(() => import('./auth/ForgotPassAdmin'));
const ListBooking = React.lazy(() => import('./booking/index'));
const ListMedicine = React.lazy(() => import('./medicine/index'));
const ListDoctor = React.lazy(() => import('./doctor/index'));
const Setting = React.lazy(() => import('./setting/index'));
export const AdminClinicRoutes = () => (
  <Routes>
    <Route path={ADMIN_CLINIC_ROUTE_NAME.SIGNIN} element={<SuspenseWrapper component={<SignIn />} />} />
    <Route path={ADMIN_CLINIC_ROUTE_NAME.FORGOT_PASSWORD} element={<ForgotPassAdmin />} />
    <Route path="" element={<SuspenseWrapper component={<AdminClinic />} />}>
      <Route path={ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT}>
        <Route path={''} element={<ListBooking />} />
        <Route
          path={ADMIN_CLINIC_ROUTE_NAME.CREATE}
          element={<SuspenseWrapper component={<CreateOrUpDateBooking />} />}
        />
        <Route
          path={`${ADMIN_CLINIC_ROUTE_NAME.DETAIL}/:id`}
          element={<SuspenseWrapper component={<CreateOrUpDateBooking />} />}
        />
        <Route path="" element={<SuspenseWrapper component={<ListBooking />} />} />
        <Route path={ADMIN_CLINIC_ROUTE_NAME.BOOKING_EMPTY} element={<ListBookingEmpty />} />
      </Route>
      <Route path={ADMIN_CLINIC_ROUTE_NAME.MEDICINE_MANAGEMENT} element={<ListMedicine />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListDoctor />} />} />
        <Route path={ADMIN_CLINIC_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateDoctor />} />} />
        <Route
          path={`${ADMIN_CLINIC_ROUTE_NAME.DETAIL}/:id`}
          element={<SuspenseWrapper component={<CreateDoctor />} />}
        />
        <Route path={`${ADMIN_CLINIC_ROUTE_NAME.SCHEDULE}/:id`} element={<DoctorSchedule />} />
      </Route>
      <Route path={ADMIN_CLINIC_ROUTE_NAME.SETTING} element={<Setting />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.ADMIN_CLINIC_PROFILE} element={<AdminClinicProfile />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.CHANGE_PASSWORD} element={<ChangePasswordAdminClinic />} />
    </Route>
  </Routes>
);
