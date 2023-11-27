import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Image, Input, Modal, Row, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import moment from 'moment';
import { ChangeEvent, KeyboardEvent, useState, MouseEvent } from 'react';
import { useIntl } from 'react-intl';
import { reportApi } from '../../../apis';
import {
  Customer,
  PaginatedReport,
  ReportProblemEnum,
  ReportStatusEnum,
  UpdateReportStatusDto,
} from '../../../apis/client-axios';
import FormWrap from '../../../components/FormWrap';
import TableWrap from '../../../components/TableWrap';
import { IFilter } from '../../../components/TimelineControl/constants';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import CustomSelect from '../../../components/select/CustomSelect';
import { TABLE_DATE_TIME_FORMAT } from '../../../util/constant';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE_NAME } from '../../../constants/route';
import ReportModal, { OpenDeleteModal } from '../../../components/modals/ReportModal';

interface IFormData {
  keyword?: string;
  status?: ReportStatusEnum[];
  problem?: ReportProblemEnum[];
}

const n = (key: keyof IFormData) => key;
const nTable = (key: keyof PaginatedReport) => key;

export const STATUSES = [
  {
    value: ReportStatusEnum.Pending,
    messageId: `report.status.${ReportStatusEnum.Pending}`,
    color: '#F7B731',
  },
  {
    value: ReportStatusEnum.Refuse,
    messageId: `report.status.${ReportStatusEnum.Refuse}`,
    color: '#D63A3A',
  },
  {
    value: ReportStatusEnum.Accept,
    messageId: `report.status.${ReportStatusEnum.Accept}`,
    color: '#3867D6',
  },
];

export const PROBLEMS = [
  {
    value: ReportProblemEnum.Trouble,
    messageId: `report.problem.${ReportProblemEnum.Trouble}`,
  },
  {
    value: ReportProblemEnum.Impersonation,
    messageId: `report.problem.${ReportProblemEnum.Impersonation}`,
  },
  {
    value: ReportProblemEnum.InvalidContent,
    messageId: `report.problem.${ReportProblemEnum.InvalidContent}`,
  },
  {
    value: ReportProblemEnum.OffensiveLanguage,
    messageId: `report.problem.${ReportProblemEnum.OffensiveLanguage}`,
  },
  {
    value: ReportProblemEnum.Cheat,
    messageId: `report.problem.${ReportProblemEnum.Cheat}`,
  },
  {
    value: ReportProblemEnum.Orther,
    messageId: `report.problem.${ReportProblemEnum.Orther}`,
  },
];

const ReportManagement = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;
  const status = Form.useWatch(n('status'), form) as ReportStatusEnum[] | undefined;
  const problem = Form.useWatch(n('problem'), form) as ReportProblemEnum[] | undefined;

  const [filter, setFilter] = useState<IFilter>({ page: 1, size: 10 });
  const [openDeleteModal, setOpenDeleteModal] = useState<OpenDeleteModal>();

  const navigate = useNavigate();

  const { data: listReport, refetch: onRefetchListReport } = useQuery({
    queryKey: ['reportPaginated', filter, status, keyword, problem],
    queryFn: () =>
      reportApi.reportControllerGetPaginatedReport(
        filter.page,
        filter.size,
        filter.sort,
        keyword,
        undefined,
        undefined,
        status,
        problem
      ),
    enabled: !!filter,
  });

  const updateStatusMutation = useMutation(
    (payload: { id: string; dto: UpdateReportStatusDto }) =>
      reportApi.reportControllerUpdateStatusReport(payload.id, payload.dto),
    {
      onError: ({ response }) => {
        message.error(response?.data?.message);
      },
      onSuccess: (_, variables) => {
        onRefetchListReport();

        if (variables.dto.status === ReportStatusEnum.Accept) {
          const findReport = listReport?.data.content?.find((report) => report.id === variables.id);

          message.error(
            intl.formatMessage({ id: 'report.modal.accept.noti' }, { customerName: findReport?.customer?.fullName })
          );
        }
      },
      onSettled: () => {
        setOpenDeleteModal(undefined);
      },
    }
  );

  const handleChangeStatus = (payload: { id: string; dto: UpdateReportStatusDto; customer: Customer }) => {
    if (payload.dto.status === ReportStatusEnum.Refuse) {
      updateStatusMutation.mutate({ id: payload.id, dto: payload.dto });
    } else if (payload.dto.status === ReportStatusEnum.Accept) {
      setOpenDeleteModal({
        visible: true,
        customer: payload.customer,
        id: payload.id,
      });
    }
  };

  const columns: ColumnsType<PaginatedReport> = [
    {
      key: nTable('order'),
      dataIndex: nTable('order'),
      title: intl.formatMessage({ id: `report.table.${nTable('order')}` }),
      render: (value: number) => <span className="font-size-14 font-family-primary color-1A1A1A">{value}</span>,
    },
    {
      key: nTable('doctorSupport'),
      dataIndex: nTable('doctorSupport'),
      title: intl.formatMessage({ id: `report.table.${nTable('doctorSupport')}` }),
      render: (_, record: PaginatedReport) => (
        <span className="font-size-14 font-family-primary color-1A1A1A">{record?.doctorSupport?.fullName}</span>
      ),
    },
    {
      key: nTable('customer'),
      dataIndex: nTable('customer'),
      title: intl.formatMessage({ id: `report.table.${nTable('customer')}` }),
      render: (_, record: PaginatedReport) => (
        <span className="font-size-14 font-family-primary color-1A1A1A">{record?.customer?.fullName}</span>
      ),
    },
    {
      key: nTable('createdOnDate'),
      dataIndex: nTable('createdOnDate'),
      title: intl.formatMessage({ id: `report.table.${nTable('createdOnDate')}` }),
      render: (value: string) => (
        <span className="font-size-14 font-family-primary color-1A1A1A">
          {moment(value).format(TABLE_DATE_TIME_FORMAT)}
        </span>
      ),
    },
    {
      key: nTable('problem'),
      dataIndex: nTable('problem'),
      title: intl.formatMessage({ id: `report.table.${nTable('problem')}` }),
      render: (value: ReportProblemEnum) => (
        <span className="font-size-14 font-family-primary color-1A1A1A">
          {intl.formatMessage({ id: `report.problem.${value}` })}
        </span>
      ),
    },
    {
      key: nTable('status'),
      dataIndex: nTable('status'),
      title: intl.formatMessage({ id: 'report.table.action' }),
      render: (value: ReportStatusEnum, record: PaginatedReport) => {
        const findStatus = STATUSES.find((status) => status.value === value);

        return value === ReportStatusEnum.Pending ? (
          <Select
            options={STATUSES.map((status) => ({
              value: status.value,
              label: (
                <span className="font-size-14 font-family-primary color-1A1A1A">
                  {intl.formatMessage({ id: status.messageId })}
                </span>
              ),
            }))}
            value={value}
            className="min-width-130 height-40 report-action"
            suffixIcon={<IconSVG type="dropdown-white" />}
            optionLabelProp="label"
            onChange={(value) =>
              handleChangeStatus({
                id: record.id,
                dto: {
                  status: value,
                },
                customer: record.customer,
              })
            }
          />
        ) : (
          <span
            className="font-size-14 font-family-primary color-ffffff p-l-r-12 border-radius-8 height-40 d-inline-block line-height-40 text-center min-width-84"
            style={{ backgroundColor: findStatus?.color, border: `1px solid ${findStatus?.color}` }}
          >
            {intl.formatMessage({ id: findStatus?.messageId })}
          </span>
        );
      },
    },
  ];

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (debouncedUpdateInputValue.cancel) {
      debouncedUpdateInputValue.cancel();
    }

    debouncedUpdateInputValue(e.target.value);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    form.setFieldValue(n('keyword'), value);
    setFilter((prev) => ({ ...prev, page: 1 }));
  }, 500);

  const handlePressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    form.setFieldValue(n('keyword'), value);
    setFilter((prev) => ({ ...prev, page: 1 }));
  };

  const handleSelectStatus = (value: string) => {
    setFilter((prev) => ({ ...prev, page: 1 }));

    const status = form.getFieldValue(n('status')) as string[];

    if (status.includes('all') && value !== 'all') {
      form.setFieldValue(
        n('status'),
        status.filter((item) => item !== 'all')
      );

      return;
    }

    if ((status.length === STATUSES.length && value !== 'all') || value === 'all') {
      form.setFieldValue(n('status'), ['all']);
    }
  };

  const handleSubmit = () => {
    if (!openDeleteModal) return;

    updateStatusMutation.mutate({ id: openDeleteModal.id, dto: { status: ReportStatusEnum.Accept } });
  };

  return (
    <Card>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <h3 className="font-size-14 font-weight-700 color-1A1A1A font-family-primary text-capitalize m-b-8">
            {intl.formatMessage({ id: 'menu.report' })}
          </h3>
        </Col>

        <Col span={24}>
          <FormWrap name="reportFilter" form={form} layout="inline">
            <Form.Item name={n('keyword')} className="d-none">
              <Input />
            </Form.Item>
            <CustomInput
              placeholder={intl.formatMessage({ id: 'report.filter.search' })}
              prefix={<IconSVG type="search" />}
              className="input-search width-350 timeline-custom-input"
              allowClear
              onChange={handleSearch}
              onPressEnter={handlePressEnter}
            />

            <Form.Item name={n('status')} className="m-b-0">
              <CustomSelect
                maxTagCount={2}
                showSearch={false}
                mode="multiple"
                placeholder={intl.formatMessage({ id: 'report.filter.status' })}
                options={[
                  {
                    value: 'all',
                    label: intl.formatMessage({
                      id: 'common.option.all',
                    }),
                  },
                  ...STATUSES.map((status) => ({
                    value: status.value,
                    label: intl.formatMessage({ id: status.messageId }),
                  })),
                ]}
                className="width-184 height-48 timeline-custom-select"
                allowClear
                onSelect={handleSelectStatus}
              />
            </Form.Item>

            <Form.Item name={n('problem')} className="m-b-0">
              <CustomSelect
                showSearch={false}
                placeholder={intl.formatMessage({ id: 'report.filter.problem' })}
                options={PROBLEMS.map((problem) => ({
                  value: problem.value,
                  label: intl.formatMessage({ id: problem.messageId }),
                }))}
                className="width-260 height-48 timeline-custom-select"
                allowClear
                onSelect={() => setFilter((prev) => ({ ...prev, page: 1 }))}
              />
            </Form.Item>
          </FormWrap>
        </Col>

        <Col span={24}>
          <TableWrap
            className="custom-table"
            showPagination
            setPage={(page) => setFilter((prev) => ({ ...prev, page }))}
            setSize={(size) => setFilter((prev) => ({ ...prev, size }))}
            page={filter.page}
            size={filter.size}
            columns={columns}
            data={listReport?.data.content || []}
            total={listReport?.data.total}
            onRow={(record: PaginatedReport) => {
              return {
                onClick: (event: MouseEvent<any>) => {
                  if ((event.target as any)?.className?.includes('ant-table')) {
                    navigate(`${ADMIN_ROUTE_NAME.DETAIL}/${record.id}`);
                  }
                },
              };
            }}
          />
        </Col>
      </Row>

      {openDeleteModal && (
        <ReportModal
          openDeleteModal={openDeleteModal}
          onCloseModal={() => setOpenDeleteModal(undefined)}
          onSubmit={handleSubmit}
        />
      )}
    </Card>
  );
};

export default ReportManagement;
