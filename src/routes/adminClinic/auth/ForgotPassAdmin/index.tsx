import { UpdatePasswordDtoTypeEnum } from '../../../../apis/client-axios';
import ForgotPassComponent from '../../../../components/auth/ForgotPassword';

const ForgotPassAdmin = () => {
  return <ForgotPassComponent userType={UpdatePasswordDtoTypeEnum.AdministratorClinic} />;
};
export default ForgotPassAdmin;
