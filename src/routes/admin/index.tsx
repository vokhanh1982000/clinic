import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authApi } from '../../apis';
import { ADMIN_ROUTE_PATH } from '../../constants/route';
import MainApp from '../../containers/App/MainApp';
import { getItem } from '../../containers/SideBar/SidebarContent';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { getMenuActiveIconName } from '../../util/menu';
import useIntlHook from '../../util/useIntl';

const Admin = () => {
  const dispatch = useAppDispatch();
  const intl = useIntlHook();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.roleManagement' }),
      ADMIN_ROUTE_PATH.ROLE_MANAGEMENT,
      <img src="/assets/icons/admin/roleManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.adminManagement' }),
      ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT,
      <img src="/assets/icons/admin/adminManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.clinicManagement' }),
      ADMIN_ROUTE_PATH.CLINIC_MANAGEMENT,
      <img src="/assets/icons/admin/clinicManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.doctorManagement' }),
      ADMIN_ROUTE_PATH.DOCTOR_MANAGEMENT,
      <img src="/assets/icons/admin/doctorManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.userManagement' }),
      ADMIN_ROUTE_PATH.USER_MANAGEMENT,
      <img src="/assets/icons/admin/userManagementIconInactive.svg" />
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
    getItem(
      intl.formatMessage({ id: 'menu.newsManagement' }),
      ADMIN_ROUTE_PATH.NEWS_MANAGEMENT,
      <img src="/assets/icons/admin/newsManagementIconInactive.svg" />
    ),
    getItem(
      intl.formatMessage({ id: 'menu.statisticsManagement' }),
      ADMIN_ROUTE_PATH.STATISTIC,
      <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />
    ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: ['adminMe'],
    queryFn: () => authApi.authControllerAdminMe(),
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
          icon: <img src={`/assets/icons/admin/${getMenuActiveIconName(item.key)}.svg`} />,
        };
      }
      return item;
    });
    setMenu(newMenu);
  };

  return <MainApp menuItems={menu}></MainApp>;
};
export default Admin;
