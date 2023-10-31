import { Card, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import TableWrap from '../../../components/TableWrap';
import Column from 'antd/es/table/Column';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import { CategoryModal } from '../../../components/modals/CategoryModal';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../../apis';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../apis/client-axios';
import { debounce } from 'lodash';
import { CustomHandleError } from '../../../components/response';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const ListMedicalSpecialty = () => {
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
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permisstion, setPermisstion] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermisstion({
        read: Boolean(CheckPermission(PERMISSIONS.ReadCaregory, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateCaregory, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteCaregory, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateCaregory, authUser)),
      });
    }
  }, [authUser]);
  const { data, isLoading } = useQuery({
    queryKey: ['categoryList', { page, size, sort, fullTextSearch }],
    queryFn: () =>
      fullTextSearch
        ? categoryApi.categoryControllerFindCategory(page, size, sort, fullTextSearch)
        : categoryApi.categoryControllerFindCategory(page, size, sort),
    enabled: permisstion.read,
  });

  const { mutate: CreateCategory, status: statusCreateCategory } = useMutation(
    (createCategory: CreateCategoryDto) => categoryApi.categoryControllerCreateCategory(createCategory),
    {
      onSuccess: (data) => {
        message.success(intl.formatMessage({ id: 'common.createSuccess' }));
        queryClient.invalidateQueries(['categoryList']);
        setIsShowModalCreate(false);
      },
      onError: (error: any) => {
        // if(response?.data.message === 'NAME_IS_EXIST'){
        //   message.error(intl.formatMessage({ id: 'category.noti.create.fail' }));
        // }else{
        //   message.error(intl.formatMessage({ id: 'category.noti.fail' }));
        // }

        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdateCategory, status: statusUpdateCategory } = useMutation(
    (updateCategory: UpdateCategoryDto) => categoryApi.categoryControllerUpdateCategory(updateCategory),
    {
      onSuccess: (data) => {
        message.success(intl.formatMessage({ id: 'common.updateSuccess' }));
        queryClient.invalidateQueries(['categoryList']);
        setIsShowModalUpdate(undefined);
      },
      onError: (error: any) => {
        // if(response?.data.message === 'NAME_IS_EXIST'){
        //   message.error(intl.formatMessage({ id: 'category.noti.create.fail' }));
        // }else if(response?.data.message === 'CATEGORY_NOT_FOUND'){
        //   message.error(intl.formatMessage({ id: 'category.noti.not.found' }));
        // }else{
        //   message.error(intl.formatMessage({ id: 'category.noti.fail' }));
        // }
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteCategory, status: statusDeleteCategory } = useMutation(
    (id: string) => categoryApi.categoryControllerDeleteCategory(id),
    {
      onSuccess: (data) => {
        message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
        queryClient.invalidateQueries(['categoryList']);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
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
      DeleteCategory(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
    form.resetFields();
  };

  const handleCreate = () => {
    const data = form.getFieldsValue();
    CreateCategory(data);
    form.resetFields();
  };

  const handleUpdate = () => {
    const data = form.getFieldsValue();
    UpdateCategory({ ...data, id: isShowModalUpdate?.id });
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
            id: 'category.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permisstion.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            setIsShowModalCreate(true);
            setAvatar(undefined);
            form.resetFields();
          }}
        >
          {intl.formatMessage({
            id: 'category.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="category-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'category.list.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
          onChange={(e) => {
            if (debouncedUpdateInputValue.cancel) {
              debouncedUpdateInputValue.cancel();
            }
            debouncedUpdateInputValue(e.target.value);
          }}
          allowClear
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
              id: 'category.list.table.name',
            })}
            dataIndex="name"
            width={'40%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'category.list.table.icon',
            })}
            dataIndex="icon"
            width={'40%'}
            render={(_, record: any) => {
              if (record.icon) return <img src={process.env.REACT_APP_URL_IMG_S3 + record.icon.preview} />;
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'category.list.table.action',
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
                  onClick={() => setIsShowModalDelete({ id: record.id, name: record.name })}
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
            id: 'category.modal.create.title.create',
          })}
          action={ActionUser.CREATE}
          onSubmit={handleCreate}
          onClose={() => setIsShowModalCreate(false)}
          avatar={avatar}
          setAvatar={setAvatar}
          permission={permisstion}
        />
      )}
      {isShowModalUpdate && (
        <CategoryModal
          form={form}
          visible={!!isShowModalUpdate}
          title={intl.formatMessage({
            id: 'category.modal.create.title.edit',
          })}
          action={ActionUser.EDIT}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setIsShowModalUpdate(undefined)}
          avatar={avatar}
          setAvatar={setAvatar}
          permission={permisstion}
        />
      )}
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        subName={intl.formatMessage({
          id: 'category.modal.delete.subName',
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
export default ListMedicalSpecialty;
