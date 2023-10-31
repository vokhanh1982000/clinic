import { Card, Form, message } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import TableWrap from '../../../components/TableWrap';
import Column from 'antd/es/table/Column';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import { CategoryModal } from '../../../components/modals/CategoryModal';
import { ActionUser, MENU_ITEM_TYPE, PERMISSIONS } from '../../../constants/enum';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { languageApi } from '../../../apis';
import { CreateCategoryDto, UpdateCategoryDto, UpdateLanguageDto } from '../../../apis/client-axios';
import { debounce } from 'lodash';
import { CustomHandleError } from '../../../components/response';
import CheckPermission, { Permission } from '../../../util/check-permission';

const LanguageManagement = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [form] = Form.useForm();
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [isShowModalUpdate, setIsShowModalUpdate] = useState<{ id: string; name: string }>();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const [avatar, setAvatar] = useState<string>();
  const [permisstion, setPermisstion] = useState<Permission>({
    read: Boolean(CheckPermission(PERMISSIONS.ReadLanguage)),
    create: Boolean(CheckPermission(PERMISSIONS.CreateLanguage)),
    delete: Boolean(CheckPermission(PERMISSIONS.DeleteLanguage)),
    update: Boolean(CheckPermission(PERMISSIONS.UpdateLanguage)),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['languageList', { page, size, sort, fullTextSearch }],
    queryFn: () =>
      fullTextSearch
        ? languageApi.languageControllerGetAllLanguageByPagination(page, size, sort, fullTextSearch)
        : languageApi.languageControllerGetAllLanguageByPagination(page, size, sort),
    enabled: permisstion.read,
  });

  const { mutate: CreateLanguage, status: statusCreateLanguage } = useMutation(
    (createLanguage: CreateCategoryDto) => languageApi.languageControllerCreateLanguage(createLanguage),
    {
      onSuccess: (data) => {
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
        queryClient.invalidateQueries(['languageList']);
        setIsShowModalCreate(false);
      },
      onError: (error: any) => {
        // if(response?.data.message === 'NAME_IS_EXIST'){
        //   message.error(intl.formatMessage({ id: 'Language.noti.create.fail' }));
        // }else{
        //   message.error(intl.formatMessage({ id: 'Language.noti.fail' }));
        // }

        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdateLanguage, status: statusUpdateLanguage } = useMutation(
    (updateLanguage: UpdateLanguageDto) => languageApi.languageControllerUpdateLanguage(updateLanguage),
    {
      onSuccess: (data) => {
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
        queryClient.invalidateQueries(['languageList']);
        setIsShowModalUpdate(undefined);
      },
      onError: (error: any) => {
        // if(response?.data.message === 'NAME_IS_EXIST'){
        //   message.error(intl.formatMessage({ id: 'Language.noti.create.fail' }));
        // }else if(response?.data.message === 'Language_NOT_FOUND'){
        //   message.error(intl.formatMessage({ id: 'Language.noti.not.found' }));
        // }else{
        //   message.error(intl.formatMessage({ id: 'Language.noti.fail' }));
        // }
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteLanguage, status: statusDeleteLanguage } = useMutation(
    (id: string) => languageApi.languageControllerDeleteLanguage(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['languageList']);
        message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
      },
      onError: (error: any) => {
        message.error(intl.formatMessage({ id: 'language.noti.fail' }));
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalUpdate && isShowModalUpdate.id) {
      setIsShowModalDelete(isShowModalUpdate);
      setIsShowModalUpdate(undefined);
      return;
    }
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteLanguage(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
    form.resetFields();
  };

  const handleCreate = () => {
    const data = form.getFieldsValue();
    CreateLanguage(data);
    form.resetFields();
  };

  const handleUpdate = () => {
    const data = form.getFieldsValue();
    UpdateLanguage({ ...data, id: isShowModalUpdate?.id });
    form.resetFields();
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  return (
    <Card id="category-management">
      <div className="category-management__header">
        <div className="category-management__header__title">
          {intl.formatMessage({
            id: 'language.title',
          })}
        </div>
        <CustomButton
          disabled={!permisstion.create}
          className="button-add-language"
          icon={<IconSVG type="create" />}
          onClick={() => {
            setIsShowModalCreate(true);
            setAvatar(undefined);
            form.resetFields();
          }}
        >
          {intl.formatMessage({
            id: 'language.btn.create',
          })}
        </CustomButton>
      </div>
      <div className="category-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'language.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
          allowClear
          onChange={(e) => {
            if (debouncedUpdateInputValue.cancel) {
              debouncedUpdateInputValue.cancel();
            }
            debouncedUpdateInputValue(e.target.value);
          }}
        />
      </div>
      {permisstion.read && (
        <TableWrap
          className="custom-table"
          data={data?.data.content}
          // isLoading={isLoading}
          page={page}
          size={size}
          total={data?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'language.table.title',
            })}
            dataIndex="name"
            width={'90%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'language.table.action',
            })}
            dataIndex="action"
            width={'20%'}
            render={(_, record: any) => (
              <div className="action-category">
                <div
                  onClick={() => {
                    form.setFieldsValue({
                      name: record.name,
                      iconId: record.iconId ? record.iconId : undefined,
                    });
                    setIsShowModalUpdate({ id: record.id, name: record.name });
                    if (record.icon) {
                      setAvatar(process.env.REACT_APP_URL_IMG_S3 + record.icon.preview);
                    } else {
                      setAvatar(undefined);
                    }
                  }}
                >
                  <IconSVG type="edit" />
                </div>
                <span className="divider"></span>
                <div
                  className={permisstion.delete ? '' : 'disable'}
                  onClick={() => permisstion.delete && setIsShowModalDelete({ id: record.id, name: record.name })}
                >
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
      )}
      {isShowModalCreate && (
        <CategoryModal
          form={form}
          visible={isShowModalCreate}
          title={intl.formatMessage({
            id: 'language.btn.create',
          })}
          action={ActionUser.CREATE}
          onSubmit={handleCreate}
          onClose={() => setIsShowModalCreate(false)}
          avatar={avatar}
          setAvatar={setAvatar}
          showType={MENU_ITEM_TYPE.LANGUAGE}
          permission={permisstion}
        />
      )}
      {isShowModalUpdate && (
        <CategoryModal
          form={form}
          visible={!!isShowModalUpdate}
          title={intl.formatMessage({
            id: 'language.detail.title',
          })}
          action={ActionUser.EDIT}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setIsShowModalUpdate(undefined)}
          avatar={avatar}
          setAvatar={setAvatar}
          showType={MENU_ITEM_TYPE.LANGUAGE}
          permission={permisstion}
        />
      )}
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        subName={intl.formatMessage({
          id: 'language.form.title',
        })}
        visible={!!isShowModalDelete}
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};
export default LanguageManagement;
