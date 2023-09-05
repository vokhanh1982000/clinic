import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';

const Customer = React.lazy(() => import('.'));
const SignInCustomer = React.lazy(() => import('./auth/SignInCustomer'));
export const CustomerRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SuspenseWrapper component={<SignInCustomer />} />} />
    <Route path="" element={<SuspenseWrapper component={<Customer />} />} />
  </Routes>
);
