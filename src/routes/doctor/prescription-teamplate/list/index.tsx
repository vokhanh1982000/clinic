import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { ActionUser, PERMISSIONS, Status } from '../../../../constants/enum';
import { doctorClinicApi, samplePrescriptionApi } from '../../../../apis';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { DoctorTable } from '../../../../components/table/DoctorTable';
import { ADMIN_CLINIC_ROUTE_NAME, DOCTOR_CLINIC_ROUTE_NAME } from '../../../../constants/route';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';
import TableWrap from '../../../../components/TableWrap';
import Column from 'antd/lib/table/Column';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { useAppSelector } from '../../../../store';
import { debounce } from 'lodash';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { CustomHandleError } from '../../../../components/response/error';

const ListPrescriptionTeamplate = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string | undefined; name: string | undefined }>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const [isShowListManager, setIsShowListManager] = useState<string>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // const [permisstion, setPermisstion] = useState<Permission>({
  //   read: Boolean(CheckPermission(PERMISSIONS.ReadDoctorClinic)),
  //   create: Boolean(CheckPermission(PERMISSIONS.CreateDoctorClinic)),
  //   delete: Boolean(CheckPermission(PERMISSIONS.DeleteDoctorClinic)),
  //   update: Boolean(CheckPermission(PERMISSIONS.UpdateDoctorClinic)),
  // });

  const { data: listPrescriptionTeamplate, isLoading } = useQuery({
    queryKey: ['listPrescriptionTeamplate', page, size, sort, fullTextSearch],
    queryFn: () => samplePrescriptionApi.prescriptionSampleControllerGetAll(page, size, sort, fullTextSearch),
    // enabled: permisstion.read
  });

  const deleteMutation = useMutation((id: string) => samplePrescriptionApi.prescriptionSampleControllerDelete(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['listPrescriptionTeamplate']);
      CustomHandleSuccess(ActionUser.DELETE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });
  const handleDelete = () => {
    if (isShowModalDelete?.id) deleteMutation.mutate(isShowModalDelete?.id as string);
    setIsShowModalDelete(undefined);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch(undefined);
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 800);

  const handleSearch = (e: any) => {
    if (debouncedUpdateInputValue.cancel) {
      debouncedUpdateInputValue.cancel();
    }
    debouncedUpdateInputValue(e.target.value);
  };

  return (
    <Card id="prescription-teamplate-management">
      <div className="prescription-teamplate-management__header">
        <div className="prescription-teamplate-management__header__title">
          {intl.formatMessage({
            id: 'prescription-teamplate.list.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(DOCTOR_CLINIC_ROUTE_NAME.CREATE);
          }}
        >
          {intl.formatMessage({
            id: 'prescription-teamplate.list.create',
          })}
        </CustomButton>
      </div>
      <div className="prescription-teamplate-table">
        <div className="prescription-teamplate-table__filter">
          <CustomInput
            placeholder={intl.formatMessage({
              id: `prescription-teamplate.list.search`,
            })}
            prefix={<IconSVG type="search" />}
            className="input-search"
            allowClear
            onChange={handleSearch}
          />
        </div>

        <TableWrap
          className="custom-table"
          data={listPrescriptionTeamplate?.data.content}
          total={listPrescriptionTeamplate?.data.total}
          isLoading={isLoading}
          page={page}
          size={size}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'prescription-teamplate.list.status',
            })}
            dataIndex="status"
            width={'22.5%'}
          />
          <Column
            title={intl.formatMessage({
              id: `prescription-teamplate.create.medice.label`,
            })}
            dataIndex="prescriptionSampleMedicine"
            width={'22.5%'}
            render={(_, record: any) => {
              const data = _.map((item: any) => {
                return {
                  name: item.medicine.name,
                  des: item.guide,
                };
              });
              if (data && data.length > 0) {
                return (
                  <div className="manager-clinic">
                    <div>{data[0].name}</div>
                    {data.length > 1 && (
                      <div className="manager-clinic__more">
                        <span style={{ cursor: 'pointer' }} onClick={() => setIsShowListManager(record.id)}>
                          <IconSVG type="more" />
                        </span>
                        {isShowListManager === record.id && (
                          <div
                            className="manager-clinic__more__list"
                            ref={isShowListManager === record.id ? wrapperRef : undefined}
                          >
                            <div className="manager-clinic__more__list__title">
                              <div className="manager-clinic__more__list__title__label">
                                {intl.formatMessage({
                                  id: 'prescription-teamplate.list.des',
                                })}
                              </div>
                              <span
                                onClick={() => {
                                  setIsShowListManager(undefined);
                                }}
                              >
                                <IconSVG type="close" />
                              </span>
                            </div>
                            <div className="manager-clinic__more__list__content">
                              {data.map((e: any) => {
                                return (
                                  <div>
                                    <span className="manager-clinic__more__list__content__item">{e.name}</span>
                                    <span className="manager-clinic__more__list__content__item__des">{e.des}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              } else {
                return <></>;
              }
            }}
          />
          <Column
            title={intl.formatMessage({
              id: `prescription-teamplate.detail.uses`,
            })}
            dataIndex="uses"
            width={'22.5%'}
          />
          <Column
            title={intl.formatMessage({
              id: `prescription-teamplate.detail.note`,
            })}
            dataIndex="note"
            width={'22.5%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'doctor.list.table.action',
            })}
            dataIndex="id"
            width={'10%'}
            render={(_, record: any) => (
              <div className="action">
                <div onClick={() => navigate(`detail/${record.id}`)}>
                  <IconSVG type="edit" />
                </div>
                <span className="divider"></span>
                <div
                  // className={permission.delete ? '' : 'disable'}
                  onClick={() => setIsShowModalDelete({ id: record.id, name: record.status })}
                >
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
        <ConfirmDeleteModal
          name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
          visible={!!isShowModalDelete?.id}
          onSubmit={handleDelete}
          onClose={() => setIsShowModalDelete(undefined)}
        />
      </div>
    </Card>
  );
};
export default ListPrescriptionTeamplate;
