import { DatePicker, Form, FormInstance, Switch, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import IconSVG from '../../icons/icons';
import CustomInput from '../../input/CustomInput';
import CustomSelect from '../../select/CustomSelect';
import { DoctorType, UserGender } from '../../../constants/enum';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, CreateCategoryDto, CreateDoctorClinicDto } from '../../../apis/client-axios';
import { DefaultOptionType } from 'antd/es/select';
import { CadastalCustom } from '../../Cadastral';
import UploadAvatar from '../../upload/UploadAvatar';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MyUploadProps } from '../../../constants/dto';
import { assetsApi, languageApi } from '../../../apis';
import DatePickerCustom from '../../date/datePicker';
import { FORMAT_DATE } from '../../../constants/common';
import { ValidateLibrary } from '../../../validate';
import { handleInputChangeUpperCase } from '../../../constants/function';

interface DoctorTableProps {
  form: FormInstance;
  avatar: string | undefined;
  provinceId?: string;
  districtId?: string;
  setAvatar: React.Dispatch<React.SetStateAction<string | undefined>>;
  setProvinceId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDistrictId: React.Dispatch<React.SetStateAction<string | undefined>>;
  placeHolder?: string;
  doctorType: DoctorType;
  n: any;
  category: Category[] | undefined;
}

interface OptionSpecialist {
  id: string;
  label: string;
}

interface OptionStatus {
  id: string;
  label: string;
}

const DoctorInfo = (props: DoctorTableProps) => {
  const intl = useIntl();
  const {
    placeHolder,
    doctorType,
    n,
    category,
    form,
    provinceId,
    districtId,
    setProvinceId,
    setDistrictId,
    avatar,
    setAvatar,
  } = props;
  const navigate = useNavigate();
  const [specialistSelect, setSpecialistSelect] = useState<OptionSpecialist>();
  const [statusSelect, setStatusSelect] = useState<OptionStatus>();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const { id } = useParams();
  const regexPhone = useRef(/^0[1-9][0-9]{8}$/);

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: MyUploadProps) =>
      assetsApi.assetControllerUploadFile(uploadProps.file, undefined, uploadProps.s3FilePath),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        form.setFieldValue('avatarId', newData.id);
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + newData.preview);
        setLoadingImg(false);
      },
      onError: (error: any) => {
        setLoadingImg(false);
        message.error(error.message);
      },
    }
  );

  const { data: language } = useQuery({
    queryKey: ['language'],
    queryFn: () => languageApi.languageControllerGetAllLanguage(),
    enabled: doctorType === DoctorType.DOCTOR_SUPPORT,
  });

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoadingImg(true);
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'avatar' });
  };

  useEffect(() => {
    if (!id) {
      form.setFieldValue('status', 1);
    }
  }, []);

  return (
    <div className="doctor-info">
      <div className="doctor-info__header">
        <div className="doctor-info__header__title">
          <div className="doctor-info__header__title__label">
            {intl.formatMessage({
              id: 'doctor.create.info.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className="doctor-info__content">
        <div className="doctor-info__content__avatar">
          <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
        </div>
        <div className="doctor-info__content__info">
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="name"
              label={intl.formatMessage({
                id: 'doctor.create.info.name',
              })}
              name={n('fullName')}
              // rules={[
              //   {
              //     required: true,
              //     message: intl.formatMessage({ id: 'common.noti.input' }),
              //   },
              //   {
              //     max: 36,
              //     message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
              //   },
              //   {
              //     pattern: /^(?![\s])[\s\S]*/,
              //     message: intl.formatMessage({ id: 'common.noti.space' }),
              //   },
              //   {
              //     pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
              //     message: intl.formatMessage({
              //       id: 'common.noti.special',
              //     }),
              //   },
              // ]}
              rules={ValidateLibrary(intl).nameDoctor}
            >
              <CustomInput maxLength={36} placeholder={intl.formatMessage({ id: 'doctor.create.info.name' })} />
            </Form.Item>
            <Form.Item
              className="code"
              label={intl.formatMessage({
                id: 'doctor.create.info.code',
              })}
              name={n('code')}
              // rules={[
              //   {
              //     required: true,
              //     message: intl.formatMessage({ id: 'common.noti.input' }),
              //   },
              //   {
              //     max: 36,
              //     message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
              //   },
              //   { pattern: /^(?![\s])[\s\S]*/, message: intl.formatMessage({ id: 'common.noti.space' }) },
              //   {
              //     pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
              //     message: intl.formatMessage({
              //       id: 'common.noti.special',
              //     }),
              //   },
              // ]}
              rules={ValidateLibrary(intl).code}
            >
              <CustomInput
                maxLength={36}
                onInput={handleInputChangeUpperCase}
                placeholder={intl.formatMessage({ id: 'doctor.create.info.code' })}
              />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="email"
              label={intl.formatMessage({
                id: 'doctor.create.info.email',
              })}
              name={n('emailAddress')}
              // rules={[
              //   {
              //     pattern: /^(?![\s])[\s\S]*/,
              //     message: intl.formatMessage({ id: 'common.noti.space' }),
              //   },
              //   { type: 'email', message: intl.formatMessage({ id: 'admin.user.email.message' }) },
              // ]}
              rules={ValidateLibrary(intl).email}
            >
              <CustomInput placeholder={intl.formatMessage({ id: 'doctor.create.info.email' })} />
            </Form.Item>
            <Form.Item
              className="phone"
              label={intl.formatMessage({
                id: 'doctor.create.info.phone',
              })}
              name={n('phoneNumber')}
              // rules={[
              //   { required: true, message: intl.formatMessage({ id: 'common.noti.input' }) },
              //   {
              //     pattern: /^0[1-9][0-9]{8}$/,
              //     message: intl.formatMessage({ id: 'sigin.validate.phone' }),
              //   },
              // ]}
              rules={ValidateLibrary(intl).phoneNumber}
            >
              <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.phone' })} />
            </Form.Item>
          </div>

          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="dob"
              label={intl.formatMessage({
                id: 'doctor.create.info.dob',
              })}
              name={n('dateOfBirth')}
              // rules={[{ required: true }]}
            >
              <DatePickerCustom
                dateFormat={FORMAT_DATE}
                className="date-select"
                placeHolder={intl.formatMessage({
                  id: 'common.place-holder.dob',
                })}
              ></DatePickerCustom>
              {/* <DatePicker /> */}
              {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
            </Form.Item>
            <Form.Item
              className="gender"
              label={intl.formatMessage({
                id: 'doctor.create.info.gender',
              })}
              name={n('gender')}
              // rules={[{ required: true }]}
              rules={ValidateLibrary(intl).dbo}
            >
              <CustomSelect
                placeholder={intl.formatMessage({
                  id: 'admin.user.gender',
                })}
                options={[
                  {
                    value: UserGender.MALE,
                    label: intl.formatMessage({
                      id: 'common.gender.male',
                    }),
                  },
                  {
                    value: UserGender.FEMALE,
                    label: intl.formatMessage({
                      id: 'common.gender.female',
                    }),
                  },
                ]}
              />
            </Form.Item>
          </div>
          <CadastalCustom
            form={form}
            setProvinceId={setProvinceId}
            setDistrictId={setDistrictId}
            districtId={districtId}
            provinceId={provinceId}
          ></CadastalCustom>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="specialist block"
              label={intl.formatMessage({
                id: 'doctor.create.info.specialist',
              })}
              name={n('categoryIds')}
              rules={ValidateLibrary(intl).specialist}
            >
              <CustomSelect
                className="select-multiple"
                placeholder={intl.formatMessage({ id: 'doctor.create.info.specialist' })}
                // maxTagCount={2}
                showSearch={false}
                mode="multiple"
                options={category?.flatMap((item) => {
                  return { value: item.id, label: item.name } as DefaultOptionType;
                })}
              />
            </Form.Item>
          </div>
          {doctorType === DoctorType.DOCTOR ? (
            <>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="level w-50"
                  label={intl.formatMessage({
                    id: 'doctor.create.info.level',
                  })}
                  name={n('level')}
                  // rules={[{ required: true }]}
                  // rules={[
                  //   {
                  //     pattern: /^(?![\s])[\s\S]*/,
                  //     message: intl.formatMessage({ id: 'common.noti.space' }),
                  //   },
                  //   {
                  //     max: 36,
                  //     message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
                  //   },
                  //   {
                  //     pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
                  //     message: intl.formatMessage({
                  //       id: 'common.noti.special',
                  //     }),
                  //   },
                  // ]}
                  rules={ValidateLibrary(intl).level}
                >
                  <CustomInput placeholder={intl.formatMessage({ id: 'doctor.list.table.level' })} />
                </Form.Item>
                <Form.Item
                  className="status w-50"
                  label={intl.formatMessage({
                    id: 'doctor.create.info.status',
                  })}
                  name={n('status')}
                  // rules={[{ required: true }]}
                >
                  <CustomSelect
                    options={[
                      {
                        value: 1,
                        label: intl.formatMessage({
                          id: 'doctor.status.true',
                        }),
                      },
                      {
                        value: 0,
                        label: intl.formatMessage({
                          id: 'doctor.status.false',
                        }),
                      },
                    ]}
                  />
                </Form.Item>
              </div>
            </>
          ) : (
            <>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="level block"
                  label={intl.formatMessage({
                    id: 'doctor.create.info.level',
                  })}
                  name={n('level')}
                  // rules={[{ required: true }]}
                  rules={ValidateLibrary(intl).level}
                >
                  <CustomInput placeholder={intl.formatMessage({ id: 'doctor.list.table.level' })} />
                </Form.Item>
                <Form.Item
                  className="specialist block"
                  label={intl.formatMessage({
                    id: 'doctor.language',
                  })}
                  name={n('languageIds')}
                >
                  <CustomSelect
                    placeholder={intl.formatMessage({ id: 'doctor.language' })}
                    maxTagCount={2}
                    showSearch={false}
                    mode="multiple"
                    options={language?.data.flatMap((item) => {
                      return { value: item.id, label: item.name } as DefaultOptionType;
                    })}
                  />
                </Form.Item>
              </div>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="status block"
                  label={intl.formatMessage({
                    id: 'doctor.create.info.status',
                  })}
                  name={n('status')}
                  // rules={[{ required: true }]}
                >
                  <CustomSelect
                    options={[
                      {
                        value: 1,
                        label: intl.formatMessage({
                          id: 'doctor.status.true',
                        }),
                      },
                      {
                        value: 0,
                        label: intl.formatMessage({
                          id: 'doctor.status.false',
                        }),
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  className="request block"
                  label={intl.formatMessage({
                    id: 'doctor.create.info.request',
                  })}
                  name={n('totalRequestReceniver')}
                  rules={ValidateLibrary(intl).realNumber}
                >
                  <CustomInput
                    type="number"
                    min={1}
                    placeholder={intl.formatMessage({ id: 'doctor.create.info.request' })}
                  />
                </Form.Item>
              </div>
            </>
          )}
          {!id && (
            <div className="doctor-info__content__info__rows">
              <Form.Item
                className="password block"
                label={intl.formatMessage({
                  id: 'doctor.create.info.password',
                })}
                name={n('password')}
                // rules={[
                //   { required: true, message: intl.formatMessage({ id: 'common.noti.input' }) },
                //   { min: 8, message: intl.formatMessage({ id: 'common.password.min' }) },
                //   { max: 16, message: intl.formatMessage({ id: 'common.password.max' }) },
                //   { pattern: /^\S*$/, message: intl.formatMessage({ id: 'common.password.space' }) },
                //   {
                //     pattern: /^[A-Za-z\d#$@!%&*?.]{8,16}$/,
                //     message: intl.formatMessage({ id: 'common.password.regex' }),
                //   },
                // ]}
                rules={ValidateLibrary(intl).passwordCustom}
              >
                <CustomInput isPassword={true} placeholder="*****" maxLength={16} />
              </Form.Item>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
