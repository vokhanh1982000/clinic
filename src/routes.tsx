import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './routes/admin/adminRoutes';
import { AdminClinicRoutes } from './routes/adminClinic/adminClinicRoutes';
import { DoctorRoutes } from './routes/doctor/doctorRoutes';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<DoctorRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="admin-clinic/*" element={<AdminClinicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
