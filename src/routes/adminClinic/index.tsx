import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authApi } from '../../apis';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH } from '../../constants/route';
import MainApp from '../../containers/App/MainApp';
import { getItem } from '../../containers/SideBar/SidebarContent';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { getMenuActiveIconName } from '../../util/menu';
import useIntlHook from '../../util/useIntl';

const AdminClinic = () => {
  const dispatch = useAppDispatch();
  const intl = useIntlHook();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.bookingManagement' }),
      ADMIN_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT,
      <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.medicineManagement' }),
      ADMIN_CLINIC_ROUTE_PATH.MEDICINE_MANAGEMENT,
      <img src="/assets/icons/admin/medicineManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.doctorManagement' }),
      ADMIN_CLINIC_ROUTE_PATH.DOCTOR_MANAGEMENT,
      <img src="/assets/icons/admin/doctorManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.setting' }),
      ADMIN_CLINIC_ROUTE_PATH.SETTING,
      <img src="/assets/icons/admin/settingIconInactive.svg" />
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

  useEffect(() => {
    handleChangeIconMenu();
  }, [location.pathname, locale]);

  const handleChangeIconMenu = () => {
    const newMenu = defaultMenu.map((item: any) => {
      if (location.pathname.includes(`${item.key}`)) {
        return {
          ...item,
          icon: <img src={`/assets/icons/admin/${getMenuActiveIconName(item.key, 'AdminClinic')}.svg`} />,
        };
      }
      return item;
    });
    setMenu(newMenu);
  };

  return <MainApp menuItems={menu}></MainApp>;
};
export default AdminClinic;
