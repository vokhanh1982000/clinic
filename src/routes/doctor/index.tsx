import { useQuery } from '@tanstack/react-query';
import MainApp from '../../containers/App/MainApp';
import { authApi } from '../../apis';
import { useEffect, useState } from 'react';
import { RootState, useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ADMIN_ROUTE_PATH, DOCTOR_CLINIC_ROUTE_PATH } from '../../constants/route';
import { getItem } from '../../containers/SideBar/SidebarContent';
import useIntlHook from '../../util/useIntl';
import { getMenuActiveIconName } from '../../util/menu';
import { PERMISSIONS } from '../../constants/enum';

const Doctor = () => {
  const dispatch = useAppDispatch();
  const intl = useIntlHook();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.bookingManagement' }),
      DOCTOR_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT,
      <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.Authenticated]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.prescriptionTeamplateManagement' }),
      DOCTOR_CLINIC_ROUTE_PATH.PRESCRIPTION_TEAMPLATE,
      <img src="/assets/icons/admin/prescriptionTeamplateInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.Authenticated]
    ),
  ];
  const [menu, setMenu] = useState(defaultMenu);

  const { data } = useQuery({
    queryKey: ['doctorMe'],
    queryFn: () => authApi.authControllerDoctorClinicMe(),
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
          icon: <img src={`/assets/icons/admin/${getMenuActiveIconName(item.key, 'Doctor')}.svg`} />,
        };
      }
      return item;
    });
    setMenu(newMenu);
  };

  return <MainApp menuItems={menu}></MainApp>;
};
export default Doctor;
