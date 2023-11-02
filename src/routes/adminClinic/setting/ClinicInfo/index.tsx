import { Form, FormInstance, Spin, TimePicker, Upload, message } from 'antd';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { assetsApi, cadastralApi } from '../../../../apis';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';
import { MyUploadProps } from '../../../../constants/dto';
import IconSVG from '../../../../components/icons/icons';
import CustomArea from '../../../../components/input/CustomArea';
import { regexImage } from '../../../../validate/validator.validate';
import { ValidateLibrary } from '../../../../validate';
import { CadastalCustom } from '../../../../components/Cadastral';

interface ClinicInfoParams {
  form: FormInstance;
  provinceId: string | undefined;
  setProvinceId: React.Dispatch<React.SetStateAction<string | undefined>>;
  districtId: string | undefined;
  setDistrictId: React.Dispatch<React.SetStateAction<string | undefined>>;
  background: string | undefined;
  setBackground: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ClinicInfo = (props: ClinicInfoParams) => {
  const { form, provinceId, setProvinceId, districtId, setDistrictId, background, setBackground } = props;
  const intl = useIntl();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: MyUploadProps) =>
      assetsApi.assetControllerUploadFile(uploadProps.file, undefined, uploadProps.s3FilePath),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        form.setFieldValue('backgroundId', newData.id);
        setBackground(process.env.REACT_APP_URL_IMG_S3 + newData.preview);
        setLoadingImg(false);
      },
      onError: (error: any) => {
        setLoadingImg(false);
        message.error(
          intl.formatMessage({
            id: 'error.IMAGE_INVALID',
          })
        );
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      message.error(
        intl.formatMessage({
          id: 'error.IMAGE_INVALID',
        })
      );
      return;
    }
    setLoadingImg(true);
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'clinic' });
  };

  const { data: listProvince, isLoading } = useQuery({
    queryKey: ['listProvince'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['listDistrict', provinceId],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvinceId(provinceId, undefined),
    enabled: !!provinceId,
  });

  const { data: listWard } = useQuery({
    queryKey: ['listWard', districtId],
    queryFn: () => cadastralApi.cadastralControllerGetWardByDistrictId(undefined, districtId),
    enabled: !!districtId,
  });

  const handleChangeProvince = (value: any) => {
    setProvinceId(value);
    form.setFieldsValue({
      districtId: undefined,
      wardId: undefined,
    });
  };

  const handleChangeDistrict = (value: any) => {
    setDistrictId(value);
    form.setFieldsValue({
      wardId: undefined,
    });
  };

  return (
    <div className="clinic-info">
      <div className="clinic-info__title">
        <div className="clinic-info__title__label">
          {intl.formatMessage({
            id: 'setting.clinic.title',
          })}
        </div>
        <div className="line-title"></div>
      </div>
      <div className="clinic-info__content">
        <div className={`clinic-info__content__rows item-center box-upload custom-box-image`}>
          <div className="clinic-info__content__image">{loadingImg ? <Spin /> : <img src={background} />}</div>
          <Form.Item name="backgroundId" className="clinic-info__content__upload">
            <Upload name="avatar" className="avatar-uploader" showUploadList={false} customRequest={customRequest}>
              <div className="icon__text">
                <IconSVG type="upload-2" />
                <span>
                  {intl.formatMessage({
                    id: 'common.upload',
                  })}
                </span>
              </div>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item
          className="name"
          label={intl.formatMessage({
            id: 'setting.clinic.name',
          })}
          name={'fullName'}
          rules={ValidateLibrary(intl).nameClinic}
        >
          <CustomInput
            placeholder={intl.formatMessage({
              id: 'setting.clinic.name',
            })}
          />
        </Form.Item>

        <CadastalCustom
          form={form}
          provinceId={provinceId}
          districtId={districtId}
          setProvinceId={setProvinceId}
          setDistrictId={setDistrictId}
        ></CadastalCustom>

        <Form.Item
          className="introduce"
          label={intl.formatMessage({
            id: 'setting.clinic.introduce',
          })}
          name={'introduce'}
        >
          <CustomArea
            rows={4}
            style={{ resize: 'none' }}
            placeholder={intl.formatMessage({
              id: 'setting.clinic.introduce',
            })}
          />
        </Form.Item>
      </div>
    </div>
  );
};
