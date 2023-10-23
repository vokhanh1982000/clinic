import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, Input } from 'antd';
import CustomArea from '../input/CustomArea';
import TableWrap from '../TableWrap';
import Column from 'antd/es/table/Column';
import { Prescription as PrescriptionType } from '../../apis/client-axios';
interface PrescriptionProp {
  prescription?: PrescriptionType;
}
const Prescription = (props: PrescriptionProp) => {
  const { prescription }: PrescriptionProp = props;
  const intl: IntlShape = useIntl();
  return (
    <div className={'prescription'}>
      <div className="prescription__header">
        <div className="prescription__header__title">
          <div className="prescription__header__title__label">
            {intl.formatMessage({
              id: 'booking.create.prescription',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className={'prescription__content'}>
        <div className={'prescription__content__rows'}>
          <Form.Item
            noStyle={true}
            className={'diagnostic-result'}
            label={intl.formatMessage({
              id: 'booking.create.prescription.diagnostic-result',
            })}
            name={['prescription', 'id']}
          >
            <Input hidden />
          </Form.Item>
          <Form.Item
            className={'diagnostic-result'}
            label={intl.formatMessage({
              id: 'booking.create.prescription.diagnostic-result',
            })}
            name={['prescription', 'diagnosticResults']}
          >
            <CustomArea
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'booking.create.prescription.diagnostic-result',
              })}
            />
          </Form.Item>
        </div>
        <div className={'prescription__content__rows'}>
          <TableWrap
            showPagination={false}
            className="custom-table"
            data={prescription?.prescriptionMedicine}
            // isLoading={isLoading}
          >
            <Column
              title={intl.formatMessage({
                id: 'booking.prescription.medicine.order',
              })}
              render={(value, record, index) => index + 1}
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'booking.prescription.medicine.name',
              })}
              render={(value) => value.medicine.name}
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'booking.prescription.medicine.quantity',
              })}
              dataIndex="quantity"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'booking.prescription.medicine.guide',
              })}
              dataIndex="guide"
              width={'15%'}
            />
          </TableWrap>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
