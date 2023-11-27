import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Col, Divider, Image, Row, message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { PROBLEMS, STATUSES } from '..';
import { reportApi } from '../../../../apis';
import { Customer, PaginatedReport, ReportStatusEnum, UpdateReportStatusDto } from '../../../../apis/client-axios';
import CustomButton from '../../../../components/buttons/CustomButton';
import ReportModal, { OpenDeleteModal } from '../../../../components/modals/ReportModal';
import { TABLE_DATE_TIME_FORMAT } from '../../../../util/constant';

const findStatus = (data?: PaginatedReport) => {
  return STATUSES.find((status) => status.value === data?.status);
};

const findProblem = (data?: PaginatedReport) => {
  return PROBLEMS.find((problem) => problem.value === data?.problem);
};

const DetailReportManagement = () => {
  const intl = useIntl();

  const { id } = useParams<{ id: string }>();

  const [openDeleteModal, setOpenDeleteModal] = useState<OpenDeleteModal>();

  const { data: reportResponse, refetch: onRefetchDetailReport } = useQuery({
    queryKey: ['detailReport', id],
    queryFn: () => reportApi.reportControllerGetReportById(id || ''),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation(
    (payload: { id: string; dto: UpdateReportStatusDto }) =>
      reportApi.reportControllerUpdateStatusReport(payload.id, payload.dto),
    {
      onError: ({ response }) => {
        message.error(response?.data?.message);
      },
      onSuccess: (_, variables) => {
        onRefetchDetailReport();

        if (variables.dto.status === ReportStatusEnum.Accept) {
          message.error(
            intl.formatMessage(
              { id: 'report.modal.accept.noti' },
              { customerName: reportResponse?.data?.customer?.fullName }
            )
          );
        }
      },
      onSettled: () => {
        setOpenDeleteModal(undefined);
      },
    }
  );

  const handleButton = (status: ReportStatusEnum) => {
    if (status === ReportStatusEnum.Accept) {
      setOpenDeleteModal({
        customer: reportResponse?.data.customer as Customer,
        id: reportResponse?.data.id as string,
        visible: true,
      });
    } else {
      updateStatusMutation.mutate({ id: reportResponse?.data.id as string, dto: { status: ReportStatusEnum.Refuse } });
    }
  };

  const handleSubmit = () => {
    if (!openDeleteModal) return;

    updateStatusMutation.mutate({ id: openDeleteModal.id, dto: { status: ReportStatusEnum.Accept } });
  };

  return (
    <Card>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row gutter={16} align="middle">
            <Col>
              <p className="font-size-14 font-weight-700 font-family-primary color-1A1A1A m-b-0">
                {intl.formatMessage({ id: 'menu.detailReport' })}
              </p>
            </Col>
            {findStatus(reportResponse?.data) && (
              <Col>
                <p
                  className="font-size-14 font-family-primary color-ffffff p-l-r-12 p-t-b-8 border-radius-8 m-b-0"
                  style={{
                    backgroundColor: findStatus(reportResponse?.data)?.color,
                    border: `1px solid ${findStatus(reportResponse?.data)?.color}`,
                  }}
                >
                  {intl.formatMessage({ id: findStatus(reportResponse?.data)?.messageId })}
                </p>
              </Col>
            )}
          </Row>
        </Col>
        <Col span={24}>
          <Row wrap={false} justify="space-around" gutter={30}>
            <Col span={15} className="border-radius-24 p-24 report-detail-container">
              <Row gutter={[0, 40]}>
                {/* doctorSupport */}
                <Col span={24}>
                  <Row gutter={[0, 36]}>
                    <Col span={24}>
                      <p className="color-702A14 font-size-14 font-weight-700 m-b-0 report-detail-title">
                        {intl.formatMessage({ id: 'report.detail.doctorSupport.title' })}
                      </p>
                    </Col>
                    <Col span={24}>
                      <Row gutter={[40, 0]} justify="center" wrap={false}>
                        {reportResponse?.data.doctorSupport?.avatar && (
                          <Col>
                            <Image
                              width={120}
                              height={120}
                              src={`${process.env.REACT_APP_URL_IMG_S3}${reportResponse?.data.doctorSupport?.avatar?.preview}`}
                              preview={false}
                              alt={reportResponse?.data?.doctorSupport?.fullName}
                              className="report-detail-avatar"
                            />
                          </Col>
                        )}
                        <Col flex="auto" className="max-width-524">
                          <Row gutter={[20, 0]} className="m-b-20" wrap={false}>
                            <Col span={17}>
                              <Row gutter={[0, 4]}>
                                <Col
                                  span={24}
                                  className="font-size-14 font-weight-700 font-family-primary color-1A1A1A"
                                >
                                  {intl.formatMessage({ id: 'report.detail.doctorSupport.name' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.doctorSupport?.fullName}
                                </Col>
                              </Row>
                            </Col>
                            <Col span={7}>
                              <Row gutter={[0, 4]}>
                                <Col className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                                  {intl.formatMessage({ id: 'report.detail.doctorSupport.code' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.doctorSupport?.code}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row gutter={[20, 0]} className="m-b-20" wrap={false}>
                            <Col span={12}>
                              <Row gutter={[0, 4]}>
                                <Col
                                  span={24}
                                  className="font-size-14 font-weight-700 font-family-primary color-1A1A1A"
                                >
                                  {intl.formatMessage({ id: 'report.detail.email' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 p-t-b-12 border-radius-32 background-color-f2f2f2 text-break min-height-48"
                                >
                                  {reportResponse?.data?.customer?.emailAddress}
                                </Col>
                              </Row>
                            </Col>
                            <Col span={12}>
                              <Row gutter={[0, 4]}>
                                <Col className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                                  {intl.formatMessage({ id: 'report.detail.phoneNumber' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.customer?.phoneNumber}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row gutter={[20, 0]} wrap={false}>
                            <Col span={12}>
                              <Row gutter={[0, 4]}>
                                <Col
                                  span={24}
                                  className="font-size-14 font-weight-700 font-family-primary color-1A1A1A"
                                >
                                  {intl.formatMessage({ id: 'report.detail.doctorSupport.category' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 p-t-b-12 border-radius-32 background-color-f2f2f2"
                                >
                                  {reportResponse?.data?.doctorSupport.categories
                                    .map((category) => category.name)
                                    .join(', ')}
                                </Col>
                              </Row>
                            </Col>
                            <Col span={12}>
                              <Row gutter={[0, 4]}>
                                <Col className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                                  {intl.formatMessage({ id: 'report.detail.doctorSupport.level' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.doctorSupport.level}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                {/* end doctorSupport */}
                {/* customer */}
                <Col span={24}>
                  <Row gutter={[0, 36]}>
                    <Col span={24}>
                      <p className="color-702A14 font-size-14 font-weight-700 m-b-0 report-detail-title">
                        {intl.formatMessage({ id: 'report.detail.customer.title' })}
                      </p>
                    </Col>
                    <Col span={24}>
                      <Row gutter={[40, 0]} justify="center" wrap={false}>
                        {reportResponse?.data.customer?.avatar && (
                          <Col>
                            <Image
                              width={120}
                              height={120}
                              src={`${process.env.REACT_APP_URL_IMG_S3}${reportResponse?.data.customer?.avatar?.preview}`}
                              preview={false}
                              alt={reportResponse?.data?.customer?.fullName}
                              className="report-detail-avatar"
                            />
                          </Col>
                        )}

                        <Col flex="auto" className="max-width-524">
                          <Row gutter={[20, 0]} className="m-b-20" wrap={false}>
                            <Col span={17}>
                              <Row gutter={[0, 4]}>
                                <Col
                                  span={24}
                                  className="font-size-14 font-weight-700 font-family-primary color-1A1A1A"
                                >
                                  {intl.formatMessage({ id: 'report.detail.customer.name' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.customer?.fullName}
                                </Col>
                              </Row>
                            </Col>

                            <Col span={7}>
                              <Row gutter={[0, 4]}>
                                <Col className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                                  {intl.formatMessage({ id: 'report.detail.customer.code' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.customer?.code}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row gutter={[20, 0]} className="m-b-41" wrap={false}>
                            <Col span={12}>
                              <Row gutter={[0, 4]}>
                                <Col
                                  span={24}
                                  className="font-size-14 font-weight-700 font-family-primary color-1A1A1A"
                                >
                                  {intl.formatMessage({ id: 'report.detail.email' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 p-t-b-12 border-radius-32 background-color-f2f2f2 text-break min-height-48"
                                >
                                  {reportResponse?.data?.customer?.emailAddress}
                                </Col>
                              </Row>
                            </Col>

                            <Col span={12}>
                              <Row gutter={[0, 4]}>
                                <Col className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                                  {intl.formatMessage({ id: 'report.detail.phoneNumber' })}
                                </Col>
                                <Col
                                  span={24}
                                  className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                                >
                                  {reportResponse?.data?.customer?.phoneNumber}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                {/* end customer */}
              </Row>
            </Col>
            <Col span={8}>
              <Row gutter={[0, 20]} className="border-radius-24 p-24 report-detail-container">
                <Col span={24}>
                  <p className="font-size-14 font-weight-700 color-702A14 m-b-0 report-detail-title">
                    {intl.formatMessage({ id: 'report.detail.content.title' })}
                  </p>
                </Col>
                <Col span={24}>
                  <Divider className="m-t-b-4" />
                </Col>
                <Col span={24}>
                  <Row gutter={[0, 4]}>
                    <Col span={24} className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                      {intl.formatMessage({ id: 'report.detail.content.time' })}
                    </Col>
                    <Col
                      span={24}
                      className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                    >
                      {moment(reportResponse?.data.createdOnDate || new Date()).format(TABLE_DATE_TIME_FORMAT)}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={[0, 4]}>
                    <Col span={24} className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                      {intl.formatMessage({ id: 'report.detail.content.problem' })}
                    </Col>
                    {findProblem(reportResponse?.data) && (
                      <Col
                        span={24}
                        className="font-size-14 font-family-primary color-808080 p-l-r-16 border-radius-32 background-color-f2f2f2 height-48 line-height-48"
                      >
                        {intl.formatMessage({
                          id: findProblem(reportResponse?.data)?.messageId,
                        })}
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={[0, 4]}>
                    <Col span={24} className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                      {intl.formatMessage({ id: 'report.detail.content.image' })}&nbsp;
                      <span className="font-weight-400 color-666666">{`(${intl.formatMessage({
                        id: 'report.detail.content.violate',
                      })})`}</span>
                    </Col>
                    {Number(reportResponse?.data.images.length) > 0 && (
                      <Col span={24}>
                        <Row gutter={8}>
                          {reportResponse?.data.images.map((image) => (
                            <Col>
                              <Image
                                preview={false}
                                width={98}
                                height={98}
                                alt={image.name}
                                src={`${process.env.REACT_APP_URL_IMG_S3}${image?.preview}`}
                                className="border-radius-4 object-fit-cover"
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={[0, 4]} className="m-b-43">
                    <Col span={24} className="font-size-14 font-weight-700 font-family-primary color-1A1A1A">
                      {intl.formatMessage({ id: 'report.detail.content.other' })}&nbsp;
                      <span className="font-weight-400 color-666666">{`(${intl.formatMessage({
                        id: 'report.detail.content.violate',
                      })})`}</span>
                    </Col>
                    <Col
                      span={24}
                      className="font-size-14 font-family-primary color-808080 p-l-r-16 p-t-b-12 border-radius-12 background-color-f2f2f2 height-96"
                    >
                      {reportResponse?.data.otherContent ??
                        intl.formatMessage({ id: 'report.detail.content.other.none' })}
                    </Col>
                  </Row>
                </Col>
              </Row>
              {findStatus(reportResponse?.data) &&
                findStatus(reportResponse?.data)?.value === ReportStatusEnum.Pending && (
                  <Row gutter={[0, 8]} className="m-t-32">
                    <Col span={24}>
                      <CustomButton
                        className="background-color-primary width-full border-color-primary"
                        onClick={() => handleButton('ACCEPT')}
                      >
                        <span className="font-size-14 font-family-primary color-ffffff">
                          {intl.formatMessage({ id: 'report.detail.button.aceept' })}
                        </span>
                      </CustomButton>
                    </Col>
                    <Col span={24}>
                      <CustomButton
                        className="backgroud-transparent width-full border-0 shadow-none"
                        onClick={() => handleButton('REFUSE')}
                      >
                        <span className="font-size-14 font-family-primary color-ee5824">
                          {intl.formatMessage({ id: 'report.detail.button.refuse' })}
                        </span>
                      </CustomButton>
                    </Col>
                  </Row>
                )}
            </Col>
          </Row>
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

export default DetailReportManagement;
