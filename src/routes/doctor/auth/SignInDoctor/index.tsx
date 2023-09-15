import { UpdatePasswordDtoTypeEnum } from '../../../../apis/client-axios';
import SignInCommon from '../../../../components/auth/login';

const SignInCustomer = () => {
  return <SignInCommon userType={UpdatePasswordDtoTypeEnum.DoctorClinic} />;
};

export default SignInCustomer;
