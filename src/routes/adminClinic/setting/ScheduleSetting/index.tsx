import { Checkbox, Form, FormInstance, TimePicker } from 'antd';
import { useIntl } from 'react-intl';
import { SetStateAction } from 'react';
import { WorkScheduleRange } from '../index';
import dayjs from 'dayjs';

interface ScheduleSettingParams {
  form: FormInstance;
  scheduleData: WorkScheduleRange[];
  setWorkSchedule: SetStateAction<any>;
}

export const ScheduleSetting = (props: ScheduleSettingParams) => {
  const { form, scheduleData, setWorkSchedule } = props;
  const intl = useIntl();
  const handleTimePickerChange = (value: any, schedule: WorkScheduleRange, field: 'am' | 'pm') => {
    if (value !== null && value[0] && value[1]) {
      const updatedSchedule = {
        ...schedule,
        [`${field}From`]: value[0].format('HH:mm'),
        [`${field}To`]: value[1].format('HH:mm'),
      };

      const newData = scheduleData.map((item) => {
        if (item.day === schedule.day) {
          return updatedSchedule;
        } else {
          return item;
        }
      });
      setWorkSchedule(newData);
    }
  };
  const handleSetStatus = (value: any, schedule: WorkScheduleRange) => {
    if (value !== null) {
      const updatedSchedule = {
        ...schedule,
        status: value,
      };
      const newData = scheduleData.map((item) => {
        if (item.day === schedule.day) {
          return updatedSchedule;
        } else {
          return item;
        }
      });
      setWorkSchedule(newData);
    }
  };
  return (
    <div className="schedule-setting">
      <div className="schedule-setting__title">
        <div className="schedule-setting__title__label">
          {intl.formatMessage({
            id: 'setting.schedule.title',
          })}
        </div>
        <div className="line-title"></div>
      </div>
      <div className="schedule-setting__content">
        <div className="schedule-setting__content__label">
          <div className="schedule-setting__content__label__item">
            {intl.formatMessage({ id: 'setting.schedule.week.title' })}
          </div>
          {scheduleData.map((schedule: WorkScheduleRange, index: number) => {
            return (
              <div className="schedule-setting__content__label__item custom-day" key={`day-${schedule.day}`}>
                <Form.Item
                  className={'ant-checkbox-group'}
                  // name={['workSchedules', schedule.day, 'status']}
                  // valuePropName="checked"
                >
                  <Checkbox
                    onChange={({ target }) => handleSetStatus(target.checked, schedule)}
                    checked={schedule.status}
                  />
                </Form.Item>
                <span>{schedule.day !== 0 ? 'Thứ ' + Number(schedule.day + 1) : 'CN'}</span>
              </div>
            );
          })}
        </div>
        <div className="schedule-setting__content__before">
          <div className="schedule-setting__content__before__item">
            {intl.formatMessage({ id: 'setting.schedule.morning.title' })}
          </div>
          {scheduleData.map((schedule: WorkScheduleRange, index: number) => {
            return (
              <div
                className={`schedule-setting__content__before__item ${!schedule.status && 'disable-time'}`}
                key={`before-${schedule.day}`}
              >
                <Form.Item hidden={true} name={['workSchedules', schedule.day, 'day']}></Form.Item>
                <Form.Item
                  name={['workSchedules', schedule.day, 'am']}
                  // initialValue={[dayjs(schedule.amFrom, 'HH:mm'), dayjs(schedule.amTo, 'HH:mm')]}
                  valuePropName={'am'}
                >
                  <TimePicker.RangePicker
                    suffixIcon={false}
                    separator={'-'}
                    key={schedule.day}
                    format={'HH:mm'}
                    minuteStep={15}
                    value={[dayjs(schedule.amFrom, 'HH:mm'), dayjs(schedule.amTo, 'HH:mm')]}
                    onChange={(value) => handleTimePickerChange(value, schedule, 'am')}
                  />
                </Form.Item>
              </div>
            );
          })}
        </div>
        <div className="schedule-setting__content__after">
          <div className="schedule-setting__content__after__item">
            {intl.formatMessage({ id: 'setting.schedule.afternoon.title' })}
          </div>
          {scheduleData.map((schedule: WorkScheduleRange, index: number) => {
            return (
              <div
                className={`schedule-setting__content__after__item ${!schedule.status && 'disable-time'}`}
                key={`after-${schedule.day}`}
              >
                <Form.Item hidden name={['workSchedules', schedule.day, 'day']}></Form.Item>
                <Form.Item hidden name={['workSchedules', schedule.day, 'id']}></Form.Item>

                <Form.Item
                  name={['workSchedules', schedule.day, 'pm']}
                  // initialValue={[dayjs(schedule.pmFrom, 'HH:mm'), dayjs(schedule.pmTo, 'HH:mm')]}
                  valuePropName={'pm'}
                  className={'time-picker'}
                >
                  <TimePicker.RangePicker
                    suffixIcon={false}
                    separator={'-'}
                    format={'HH:mm'}
                    value={[dayjs(schedule.pmFrom, 'HH:mm'), dayjs(schedule.pmTo, 'HH:mm')]}
                    minuteStep={15}
                    onChange={(value) => handleTimePickerChange(value, schedule, 'pm')}
                  />
                </Form.Item>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="schedule-setting__content">
        <div className="schedule-setting__content__label">
          <div>Tuần</div>
          <div>Buổi sáng</div>
          <div>Buổi chiều</div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(1)}>
              <IconSVG type={scheduleCheck[0].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>Thứ 2</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(2)}>
              <IconSVG type={scheduleCheck[1].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>Thứ 3</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(3)}>
              <IconSVG type={scheduleCheck[2].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>Thứ 4</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(4)}>
              <IconSVG type={scheduleCheck[3].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>Thứ 5</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(5)}>
              <IconSVG type={scheduleCheck[4].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>Thứ 6</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(6)}>
              <IconSVG type={scheduleCheck[5].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>Thứ 7</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
        <div className="schedule-setting__content__day">
          <div className="header">
            <span onClick={() => handleClick(7)}>
              <IconSVG type={scheduleCheck[6].status ? 'checkbox-active' : 'checkbox-inactive'} />
            </span>
            <span>CN</span>
          </div>
          <div>
            <span className="time">08:00 - 12:00</span>
          </div>
          <div>
            <span className="time">13:30 - 17:30</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};
