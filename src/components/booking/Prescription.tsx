import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, Input } from 'antd';
import CustomArea from '../input/CustomArea';
import TableWrap from '../TableWrap';
import Column from 'antd/es/table/Column';
import { BookingStatusEnum, Prescription as PrescriptionType, PrescriptionMedicine } from '../../apis/client-axios';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import ProvideMedicineModal from '../modals/ProvideMedicineModal';
import SamplePrescriptionModal from '../modals/SamplePrescriptionModal';

interface PrescriptionProp {
  role?: 'doctor' | 'admin' | 'adminClinic';
  type?: 'create' | 'update';
  prescription?: PrescriptionType;
  setPrescription?: Dispatch<SetStateAction<PrescriptionType | undefined>>;
  status?: BookingStatusEnum;
  isPrescribed?: boolean;
}
const Prescription = (props: PrescriptionProp) => {
  const { prescription, role, setPrescription, type, status, isPrescribed }: PrescriptionProp = props;
  const intl: IntlShape = useIntl();
  const [showProvideMedicineModalCreate, setShowProvideMedicineModalCreate] = useState<boolean>();
  const [showProvideMedicineModalUpdate, setShowProvideMedicineModalUpdate] = useState<PrescriptionMedicine>();
  const [showSamplePrescriptionModal, setShowSamplePrescriptionModal] = useState<any>(false);
  const [selectedPrescriptionMedicine, setSelectedPrescriptionMedicine] = useState<PrescriptionMedicine>();
  const [prescriptionMedicine, setPrescriptionMedicine] = useState<PrescriptionMedicine[]>();

  useEffect(() => {
    setPrescriptionMedicine(prescription?.prescriptionMedicine);
  }, [prescription]);

  useEffect(() => {
    if (setPrescription) {
      setPrescription((prevState) => {
        return { ...prevState, prescriptionMedicine } as PrescriptionType;
      });
    }
  }, [prescriptionMedicine]);
  const handleRemovePrescriptionMedicine = (medicineId: string) => {
    if (setPrescription) {
      setPrescriptionMedicine((prevState) => {
        if (!prevState) {
          return;
        }
        const existingItemIndex: number | undefined = prevState?.findIndex(
          (item: PrescriptionMedicine) => item.medicineId === medicineId
        );
        if (existingItemIndex !== -1) {
          return prevState.filter((item) => item.medicineId !== medicineId);
        }
      });
    }
  };

  const isDisable = () => {
    return !(status === BookingStatusEnum.Completed) || isPrescribed;
  };
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

        <div className={'prescription__header__action'}>
          {role === 'doctor' && (
            <CustomButton
              className={'button-sample-prescription'}
              onClick={() => setShowSamplePrescriptionModal(true)}
              disabled={isDisable()}
            >
              <span className={'icon-sample-prescription'}>
                <IconSVG type={'sample-prescription'} />
              </span>
              {intl.formatMessage({ id: 'booking.button.sample-prescription' })}
            </CustomButton>
          )}
          {(role === 'doctor' || role === 'admin') && (
            <CustomButton
              className={'button-provide-medicine'}
              onClick={() => setShowProvideMedicineModalCreate(true)}
              disabled={isDisable()}
            >
              <span className={'icon-provide-medicine'}>
                <IconSVG type={'provide-medicine'} />
              </span>
              {intl.formatMessage({ id: 'booking.button.provide-medicine' })}
            </CustomButton>
          )}
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
              disabled={role !== 'doctor' || isDisable()}
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
            data={prescriptionMedicine}
            // isLoading={isLoading}
          >
            <Column
              title={intl.formatMessage({
                id: 'booking.prescription.medicine.order',
              })}
              render={(value, record, index) => index + 1}
              width={'10%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'booking.prescription.medicine.name',
              })}
              render={(_, record: PrescriptionMedicine) => (
                <>
                  {(role === 'doctor' || role === 'admin') && !isDisable() ? (
                    <div className={'table-cell-name'} onClick={() => setShowProvideMedicineModalUpdate(record)}>
                      {record.medicine?.name}
                    </div>
                  ) : (
                    <div className={'table-cell-name'}>{record.medicine?.name}</div>
                  )}
                </>
              )}
              width={'25%'}
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
              width={'50%'}
              render={(_, record: PrescriptionMedicine) => (
                <div className="table-cell-guide">
                  <span>{record.guide}</span>
                  {(role === 'doctor' || role === 'admin') && !isDisable() && (
                    <span
                      className={'table-cell-guide__icon'}
                      onClick={() => handleRemovePrescriptionMedicine(record.medicineId)}
                    >
                      <IconSVG type="small-close" />
                    </span>
                  )}
                </div>
              )}
            />
          </TableWrap>
        </div>
      </div>

      <ProvideMedicineModal
        role={role}
        type={'create'}
        visible={!!showProvideMedicineModalCreate}
        title={intl.formatMessage({ id: 'booking.provide-medicine.modal.create.title' })}
        onClose={() => setShowProvideMedicineModalCreate(false)}
        setPrescriptionMedicine={setPrescriptionMedicine}
      />
      <ProvideMedicineModal
        role={role}
        type={'update'}
        visible={!!showProvideMedicineModalUpdate}
        prescriptionMedicine={showProvideMedicineModalUpdate}
        title={intl.formatMessage({ id: 'booking.provide-medicine.modal.update.title' })}
        setPrescriptionMedicine={setPrescriptionMedicine}
        onClose={() => setShowProvideMedicineModalUpdate(undefined)}
        handleRemovePrescriptionMedicine={handleRemovePrescriptionMedicine}
      />
      <SamplePrescriptionModal
        visible={!!showSamplePrescriptionModal}
        onClose={() => setShowSamplePrescriptionModal(undefined)}
        setPrescription={setPrescription}
        prescription={prescription}
      />
    </div>
  );
};

export default Prescription;
