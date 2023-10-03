import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_CLINIC_ROUTE_NAME, DOCTOR_CLINIC_ROUTE_NAME } from '../../constants/route';

const AdminClinic = React.lazy(() => import('.'));
const SignIn = React.lazy(() => import('./auth/SignIn'));
const ListBooking = React.lazy(() => import('./booking/index'));
const ListMedicine = React.lazy(() => import('./medicine/index'));
const ListDoctor = React.lazy(() => import('./doctor/index'));
const CreateDoctor = React.lazy(() => import('./doctor/createOrUpdate/index'));
export const AdminClinicRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SuspenseWrapper component={<SignIn />} />} />
    <Route path="" element={<SuspenseWrapper component={<AdminClinic />} />}>
      <Route path={ADMIN_CLINIC_ROUTE_NAME.BOOKING_MANAGEMENT} element={<ListBooking />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.MEDICINE_MANAGEMENT} element={<ListMedicine />} />
      <Route path={ADMIN_CLINIC_ROUTE_NAME.DOCTOR_MANAGEMENT}>
        <Route path="" element={<SuspenseWrapper component={<ListDoctor />} />} />
        <Route path={DOCTOR_CLINIC_ROUTE_NAME.CREATE} element={<SuspenseWrapper component={<CreateDoctor />} />} />
        <Route
          path={`${DOCTOR_CLINIC_ROUTE_NAME.DETAIL}/:id`}
          element={<SuspenseWrapper component={<CreateDoctor />} />}
        />
      </Route>
    </Route>
  </Routes>
);
