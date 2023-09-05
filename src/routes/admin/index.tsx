import { useQuery } from '@tanstack/react-query';
import MainApp from '../../containers/App/MainApp';
import { useAppDispatch } from '../../store';
import { adminMenuItems } from './adminMenuItems';
import { useEffect } from 'react';
import { updateMe } from '../../store/authSlice';
import { authApi } from '../../apis';

const Admin = () => {
  const dispatch = useAppDispatch();

  const { data } = useQuery({
    queryKey: ['adminMe'],
    queryFn: () => authApi.authControllerAdminMe(),
  });

  useEffect(() => {
    if (data) {
      dispatch(updateMe(data.data));
    }
  }, [data]);

  return <MainApp menuItems={adminMenuItems}></MainApp>;
};
export default Admin;
