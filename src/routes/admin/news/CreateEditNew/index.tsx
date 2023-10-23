import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Spin, Switch, Upload, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, newsApi } from '../../../../apis';
import { CreateNewDto, UpdateNewDto } from '../../../../apis/client-axios';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { MyUploadProps } from '../../../../constants/dto';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { regexImage } from '../../../../validate/validator.validate';

const CreateNew = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<{ id: string; src: string }>();
  const [isDeleteNew, setIsDeleteNew] = useState<boolean>(false);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [dataEditor, setDataEditor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loadingImgOnEditor, setLoadingImgOnEditor] = useState<boolean>(false);

  const { data: dataNew } = useQuery(['getDetailnew', id], () => newsApi.newControllerGetDetail(id as string), {
    onError: (error) => {},
    onSuccess: (response) => {
      setTitle(response.data.title || '');
      setDataEditor(response.data.content || '');
      setStatus(response.data.status);
      if (response.data.avatar) {
        setAvatar({
          id: response.data.avatar.id,
          src: process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview,
        });
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutate: DeleteNew, status: statusDeleteNew } = useMutation(
    (id: string) => newsApi.newControllerDeleteNew(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['newList']);
        navigate(`/admin/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`);
        message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    }
  );

  const { mutate: newCreate, status: statusCreateNew } = useMutation(
    (createnew: CreateNewDto) => newsApi.newControllerCreateNew(createnew),
    {
      onSuccess: ({ data }) => {
        navigate(`/admin/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`);
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'new.create.error' }));
      },
    }
  );

  const { mutate: newUpdate, status: statusUpdatenew } = useMutation(
    (updatenew: UpdateNewDto) => newsApi.newControllerUpdateNew(id as string, updatenew),
    {
      onSuccess: ({ data }) => {
        navigate(`/admin/${ADMIN_ROUTE_NAME.NEWS_MANAGEMENT}`);
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'new.update.error' }));
      },
    }
  );

  const onFinish = () => {
    setIsSubmit(true);
    if (title.trim() === '' || dataEditor === '' || !avatar || avatar.id === '') {
      return;
    }
    if (id) {
      newUpdate({
        title: title,
        content: dataEditor,
        status: status,
        backgroundId: avatar?.id,
      });
    } else {
      newCreate({
        title: title,
        content: dataEditor,
        status: status,
        backgroundId: avatar?.id,
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteNew && id) {
      DeleteNew(id);
    }
    setIsDeleteNew(false);
  };

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: MyUploadProps) =>
      assetsApi.assetControllerUploadFile(uploadProps.file, undefined, uploadProps.s3FilePath),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        setAvatar({ id: newData.id, src: process.env.REACT_APP_URL_IMG_S3 + newData.preview });
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
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'new' });
  };

  const handleChange = (event: any, editor: any) => {
    const data = editor.getData();
    setDataEditor(data);
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      setLoadingImgOnEditor(true);
      return uploadAdapter(loader);
    };
  }

  const uploadAdapter = (loader: any) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file: any) => {
            const body = new FormData();
            body.append('file', file);
            body.append('s3FilePath', 'new');
            const token = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);
            fetch(`${process.env.REACT_APP_API_URL}/assets/upload`, {
              method: 'post',
              body: body,
              headers: headers,
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.error) {
                  setLoadingImgOnEditor(false);
                  reject(
                    intl.formatMessage({
                      id: 'common.upload.fail',
                    })
                  );
                }

                setLoadingImgOnEditor(false);

                resolve({
                  default: `${process.env.REACT_APP_URL_IMG_S3}${res?.preview}`,
                });
              })
              .catch((err) => {
                setLoadingImgOnEditor(false);
                reject(err);
              });
          });
        });
      },
    };
  };

  return (
    <Card id="create-new-management">
      <div className="container-new">
        <div
          className={`left-container ${isSubmit && dataEditor === '' && 'content-error'} ${
            loadingImgOnEditor && 'loading-img-editor'
          }`}
        >
          {loadingImgOnEditor && <Spin />}
          <CKEditor
            config={{
              extraPlugins: [uploadPlugin],
            }}
            editor={ClassicEditor}
            data={dataEditor}
            onChange={handleChange}
          />
          {isSubmit && dataEditor === '' && (
            <span className="text-error">
              {intl.formatMessage({
                id: 'new.create.error.content',
              })}
            </span>
          )}
        </div>
        <div className="right-container">
          <div className="right-container__content">
            <div
              className={`right-container__content__image ${
                isSubmit && (!avatar || avatar?.src === '') && 'image-error'
              }`}
            >
              {loadingImg ? (
                <Spin />
              ) : avatar && avatar.src ? (
                <div className="right-container__content__image__display">
                  <img src={avatar.src} />
                  <span
                    onClick={() => {
                      setAvatar(undefined);
                    }}
                  >
                    <IconSVG type="close-white" />
                  </span>
                </div>
              ) : (
                <div className="right-container__content__image__upload">
                  <Upload
                    name="avatar"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={customRequest}
                  >
                    <span className="icon-upload">
                      <IconSVG type="upload-2" />
                    </span>
                    <div className="text-upload">
                      {intl.formatMessage({
                        id: 'new.create.upload',
                      })}
                    </div>
                  </Upload>
                </div>
              )}
            </div>
            {isSubmit && (!avatar || avatar?.src === '') && (
              <span className="text-error custom-label">
                {intl.formatMessage({
                  id: 'new.create.error.image',
                })}
              </span>
            )}
            <div className="right-container__content__title">
              <div className="right-container__content__title__label">
                {intl.formatMessage({
                  id: 'new.create.title',
                })}
              </div>
              <CustomInput
                value={title}
                className={`${isSubmit && title === '' && 'title-error'}`}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
              />
              {isSubmit && title.trim() === '' && (
                <span className="text-error">
                  {intl.formatMessage({
                    id: 'new.create.error.title',
                  })}
                </span>
              )}
            </div>
            <div className="right-container__content__status custom-switch">
              <div className="right-container__content__status__label">
                {intl.formatMessage({
                  id: 'new.create.status',
                })}
              </div>
              <Switch
                checked={status}
                onChange={(e) => {
                  setStatus(e);
                }}
              />
            </div>
          </div>
          <div className="right-container__action">
            {id ? (
              <div className="more-action">
                <CustomButton className="button-save" onClick={onFinish} disabled={loadingImg || loadingImgOnEditor}>
                  {intl.formatMessage({
                    id: 'new.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-delete"
                  onClick={() => {
                    setIsDeleteNew(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'new.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={onFinish} disabled={loadingImg || loadingImgOnEditor}>
                  {intl.formatMessage({
                    id: 'new.create.button.create',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'new.create.button.cancel',
                  })}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        name={''}
        visible={isDeleteNew}
        onSubmit={handleDelete}
        onClose={() => setIsDeleteNew(false)}
      />
    </Card>
  );
};

export default CreateNew;
