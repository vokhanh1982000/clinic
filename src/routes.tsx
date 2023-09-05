import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './routes/admin/adminRoutes';
import { CustomerRoutes } from './routes/customer/customerRoutes';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
