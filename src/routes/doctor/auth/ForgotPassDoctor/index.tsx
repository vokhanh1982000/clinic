import { UpdatePasswordDtoTypeEnum } from '../../../../apis/client-axios';
import ForgotPassComponent from '../../../../components/auth/ForgotPassword';

const ForgotPassDoctor = () => {
  return <ForgotPassComponent userType={UpdatePasswordDtoTypeEnum.DoctorClinic} />;
};
export default ForgotPassDoctor;
