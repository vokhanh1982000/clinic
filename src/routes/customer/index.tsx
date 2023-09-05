import { useQuery } from '@tanstack/react-query';
import MainApp from '../../containers/App/MainApp';
import { customerMenuItems } from './customerMenuItems';
import { authApi } from '../../apis';
import { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { updateMe } from '../../store/authSlice';

const Customer = () => {
  const dispatch = useAppDispatch();

  const { data } = useQuery({
    queryKey: ['customerMe'],
    queryFn: () => authApi.authControllerCustomerMe(),
  });

  useEffect(() => {
    if (data) {
      dispatch(updateMe(data.data));
    }
  }, [data]);

  return <MainApp menuItems={customerMenuItems}></MainApp>;
};
export default Customer;
