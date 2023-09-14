import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';

const AdminClinic = React.lazy(() => import('.'));
const SignIn = React.lazy(() => import('./auth/SignIn'));
export const AdminClinicRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SuspenseWrapper component={<SignIn />} />} />
    <Route path="" element={<SuspenseWrapper component={<AdminClinic />} />} />
  </Routes>
);
