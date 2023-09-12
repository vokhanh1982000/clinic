import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import ConfirmCode from './auth/ForgotPassAdmin/confirmCode';
import ConfirmPassword from './auth/ForgotPassAdmin/confirmPassword';
import ForgotSuccess from './auth/ForgotPassAdmin/forgotSuccess';

const Admin = React.lazy(() => import('./index'));
const ListCustomer = React.lazy(() => import('./customer/ListCustomer'));
const ListRole = React.lazy(() => import('./role/ListRole'));
const CreateRole = React.lazy(() => import('./role/CreateEditRole'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));
const ForgotPassAdmin = React.lazy(() => import('./auth/ForgotPassAdmin'));

export const AdminRoutes = () => (
  <Routes>
    <Route path="signin" element={<SignInAdmin />} />
    <Route path="forgot-password" element={<ForgotPassAdmin />} />
    {/* <Route path="confirm-code" element={<ConfirmCode />} />
    <Route path="confirm-password" element={<ConfirmPassword />} />
    <Route path="forgot-success" element={<ForgotSuccess />} /> */}
    <Route path="" element={<Admin />}>
      <Route path="customers" element={<ListCustomer />} />
      <Route path="roles">
        <Route path="" element={<SuspenseWrapper component={<ListRole />} />} />
        <Route path="create" element={<SuspenseWrapper component={<CreateRole />} />} />
        <Route path="detail/:id" element={<SuspenseWrapper component={<CreateRole />} />} />
      </Route>
    </Route>
  </Routes>
);
