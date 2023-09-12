import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SuspenseWrapper } from '../../components/loading/SuspenseWrap';
import { ADMIN_ROUTE_NAME } from '../../constants/route';

const Admin = React.lazy(() => import('./index'));
const ListCustomer = React.lazy(() => import('./customer/ListCustomer'));
const ListRole = React.lazy(() => import('./role/ListRole'));
const CreateRole = React.lazy(() => import('./role/CreateEditRole'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));

export const AdminRoutes = () => (
  <Routes>
    <Route path={ADMIN_ROUTE_NAME.SIGNIN} element={<SignInAdmin />} />
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
