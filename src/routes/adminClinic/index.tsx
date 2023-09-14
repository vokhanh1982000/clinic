import { useQuery } from '@tanstack/react-query';
import MainApp from '../../containers/App/MainApp';
import { authApi } from '../../apis';
import { useEffect, useState } from 'react';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import { getItem } from '../../containers/SideBar/SidebarContent';
import useIntlHook from '../../util/useIntl';

const AdminClinic = () => {
  const dispatch = useAppDispatch();
  const intl = useIntlHook();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.doctorManagement' }),
      ADMIN_ROUTE_PATH.DOCTOR_MANAGEMENT,
      <img src="/assets/icons/admin/doctorManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.medicalSpecialtyManagement' }),
      ADMIN_ROUTE_PATH.MEDICAL_SPECIALTY_MANAGEMENT,
      <img src="/assets/icons/admin/medicalSpecialtyManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.bookingManagement' }),
      ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT,
      <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />
    ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: ['adminClinicMe'],
    queryFn: () => authApi.authControllerAdminClinicMe(),
  });

  useEffect(() => {
    if (data) {
      dispatch(updateMe(data.data));
    }
  }, [data]);

  return <MainApp menuItems={menu}></MainApp>;
};
export default AdminClinic;
