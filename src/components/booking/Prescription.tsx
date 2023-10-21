import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form } from 'antd';
import CustomArea from '../input/CustomArea';
import TableWrap from '../TableWrap';
import Column from 'antd/es/table/Column';

const Prescription = () => {
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
            className={'diagnostic-result'}
            label={intl.formatMessage({
              id: 'booking.create.prescription.diagnostic-result',
            })}
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
            // data={data?.data.content}
            // isLoading={isLoading}
          >
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.name',
              })}
              dataIndex="name"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.name',
              })}
              dataIndex="name"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.name',
              })}
              dataIndex="name"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.name',
              })}
              dataIndex="name"
              width={'15%'}
            />
          </TableWrap>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
