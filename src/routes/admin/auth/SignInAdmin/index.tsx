import { UpdatePasswordDtoTypeEnum } from '../../../../apis/client-axios';
import SignInCommon from '../../../../components/auth/login';

const SignInAdmin = () => {
  return <SignInCommon userType={UpdatePasswordDtoTypeEnum.Administrator} />;
};

export default SignInAdmin;
