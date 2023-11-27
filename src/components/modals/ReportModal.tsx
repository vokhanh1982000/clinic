import { Col, Image, Modal, Row } from 'antd';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Customer } from '../../apis/client-axios';
import CustomButton from '../buttons/CustomButton';

export interface OpenDeleteModal {
  visible: boolean;
  customer: Customer;
  id: string;
}

interface ReportModalProps {
  openDeleteModal?: OpenDeleteModal;
  onCloseModal: () => void;
  onSubmit: () => void;
}

const ReportModal: FC<ReportModalProps> = (props) => {
  const { openDeleteModal, onCloseModal, onSubmit } = props;

  const intl = useIntl();

  return (
    <>
      <Modal
        centered
        destroyOnClose
        open={!!openDeleteModal?.visible}
        footer={null}
        width={608}
        title={
          <span className="font-size-24 font-family-primary font-weight-600 d-inline-block text-center">
            {intl.formatMessage({ id: 'report.modal.accept.title' })}
          </span>
        }
        rootClassName="report-modal"
        closable={false}
      >
        <Row gutter={[0, 32]} align="middle" justify="center">
          <Col span={24}>
            <Row gutter={12} align="middle" justify="center">
              <Col>
                <Image
                  src={`${process.env.REACT_APP_URL_IMG_S3}${openDeleteModal?.customer?.avatar?.preview}`}
                  preview={false}
                  alt={openDeleteModal?.customer?.fullName}
                  width={72}
                  height={72}
                />
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={24} className="color-702A14 font-size-18 font-weight-700 font-family-primary">
                    {openDeleteModal?.customer?.fullName}
                  </Col>
                  <Col span={24} className="font-size-16 font-family-primary color-4C4C4C">
                    {openDeleteModal?.customer?.emailAddress}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={8}>
              <Col span={24}>
                <CustomButton className="background-color-primary width-full height-48" onClick={onSubmit}>
                  <span className="font-size-16 color-ffffff font-family-primary">
                    {intl.formatMessage({ id: 'common.accept' })}
                  </span>
                </CustomButton>
              </Col>
              <Col span={24}>
                <CustomButton className="width-full height-48 report-modal-button-cancel" onClick={onCloseModal}>
                  <span className="font-size-16 font-family-primary color-333333">
                    {intl.formatMessage({ id: 'common.cancel' })}
                  </span>
                </CustomButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ReportModal;
