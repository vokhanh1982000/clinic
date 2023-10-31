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
import { PERMISSIONS } from '../../constants/enum';

const Admin = () => {
  const dispatch = useAppDispatch();
  const intl = useIntlHook();
  const location = useLocation();
  const { locale } = useSelector((state: RootState) => state.setting);

  const defaultMenu = [
    getItem(
      intl.formatMessage({ id: 'menu.roleManagement.sideBar' }),
      ADMIN_ROUTE_PATH.ROLE_MANAGEMENT,
      <img src="/assets/icons/admin/roleManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadRole, PERMISSIONS.CreateRole, PERMISSIONS.UpdateRole, PERMISSIONS.DeleteRole]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.adminManagement' }),
      ADMIN_ROUTE_PATH.ADMIN_MANAGEMENT,
      <img src="/assets/icons/admin/adminManagementIconInactive.svg" />,
      undefined,
      undefined,
      [
        PERMISSIONS.ReadAdministrator,
        PERMISSIONS.CreateAdministrator,
        PERMISSIONS.UpdateAdministrator,
        PERMISSIONS.DeleteAdministrator,
      ]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.clinicManagement' }),
      ADMIN_ROUTE_PATH.CLINIC_MANAGEMENT,
      <img src="/assets/icons/admin/clinicManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadClinic, PERMISSIONS.CreateClinic, PERMISSIONS.UpdateClinic, PERMISSIONS.DeleteClinic]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.doctorSupportManagement' }),
      ADMIN_ROUTE_PATH.DOCTOR_MANAGEMENT,
      <img src="/assets/icons/admin/doctorManagementIconInactive.svg" />,
      undefined,
      undefined,
      [
        PERMISSIONS.ReadDoctorSuppot,
        PERMISSIONS.CreateDoctorSuppot,
        PERMISSIONS.UpdateDoctorSuppot,
        PERMISSIONS.DeleteDoctorSuppot,
      ]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.userManagement' }),
      ADMIN_ROUTE_PATH.USER_MANAGEMENT,
      <img src="/assets/icons/admin/userManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadCustomer, PERMISSIONS.CreateCustomer, PERMISSIONS.UpdateCustomer, PERMISSIONS.DeleteCustomer]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.medicalSpecialtyManagement' }),
      ADMIN_ROUTE_PATH.MEDICAL_SPECIALTY_MANAGEMENT,
      <img src="/assets/icons/admin/medicalSpecialtyManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadCaregory, PERMISSIONS.CreateCaregory, PERMISSIONS.UpdateCaregory, PERMISSIONS.DeleteCaregory]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.bookingManagement' }),
      ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT,
      <img src="/assets/icons/admin/bookingManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadBooking, PERMISSIONS.CreateBooking, PERMISSIONS.UpdateBooking, PERMISSIONS.DeleteBooking]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.newsManagement' }),
      ADMIN_ROUTE_PATH.NEWS_MANAGEMENT,
      <img src="/assets/icons/admin/newsManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadNew, PERMISSIONS.CreateNew, PERMISSIONS.UpdateNew, PERMISSIONS.DeleteNew]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.statisticsManagement' }),
      ADMIN_ROUTE_PATH.STATISTIC,
      <img src="/assets/icons/admin/statisticsManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.Authenticated]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.medicineManagement' }),
      ADMIN_ROUTE_PATH.MEDICINE_MANAGEMENT,
      <img src="/assets/icons/admin/medicineManagementIconInactive.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadMedicine, PERMISSIONS.CreateMedicine, PERMISSIONS.UpdateMedicine, PERMISSIONS.DeleteMedicine]
    ),
    getItem(
      intl.formatMessage({ id: 'menu.languageManagement' }),
      ADMIN_ROUTE_PATH.LANGUAGE_MANAGEMENT,
      <img src="/assets/icons/admin/languageManagement.svg" />,
      undefined,
      undefined,
      [PERMISSIONS.ReadLanguage, PERMISSIONS.CreateLanguage, PERMISSIONS.UpdateLanguage, PERMISSIONS.DeleteLanguage]
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
          icon: <img src={`/assets/icons/admin/${getMenuActiveIconName(item.key, 'Admin')}.svg`} />,
        };
      }
      return item;
    });
    setMenu(newMenu);
  };

  return <MainApp menuItems={menu}></MainApp>;
};
export default Admin;
