import { UpdatePasswordDtoTypeEnum } from '../../../../apis/client-axios';
import SignInCommon from '../../../../components/auth/login';

const SignInAdmin = () => {
  return <SignInCommon userType={UpdatePasswordDtoTypeEnum.AdministratorClinic} />;
};

export default SignInAdmin;
