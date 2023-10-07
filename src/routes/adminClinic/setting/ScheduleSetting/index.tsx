import { Checkbox, FormInstance } from 'antd';
import { useIntl } from 'react-intl';
import IconSVG from '../../../../components/icons/icons';
import { useState } from 'react';

interface ScheduleSettingParams {
  form: FormInstance;
}

export const ScheduleSetting = (props: ScheduleSettingParams) => {
  const { form } = props;
  const intl = useIntl();
  const [scheduleCheck, setScheduleCheck] = useState<any>([
    { day: 1, checked: true },
    { day: 2, checked: false },
    { day: 3, checked: true },
    { day: 4, checked: true },
    { day: 5, checked: true },
    { day: 6, checked: true },
    { day: 7, checked: true },
  ]);

  const handleClick = (index: number) => {
    const updatedScheduleCheck = [...scheduleCheck];
    const indexToUpdate = updatedScheduleCheck.findIndex((item) => item.day === index);
    if (indexToUpdate !== -1) {
      updatedScheduleCheck[indexToUpdate].checked = !updatedScheduleCheck[indexToUpdate].checked;
    }
    setScheduleCheck(updatedScheduleCheck);
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
          <div className="schedule-setting__content__label__item">Tuần</div>
          {scheduleCheck.map((schedule: any, index: number) => {
            return (
              <div className="schedule-setting__content__label__item custom-day" key={`day-${index}`}>
                <span onClick={() => handleClick(schedule.day)}>
                  <IconSVG type={schedule.checked ? 'checkbox-active' : 'checkbox-inactive'} />
                </span>
                <span>{schedule.day !== 7 ? 'Thứ ' + Number(schedule.day + 1) : 'CN'}</span>
              </div>
            );
          })}
        </div>
        <div className="schedule-setting__content__before">
          <div className="schedule-setting__content__before__item">Buổi sáng</div>
          {scheduleCheck.map((schedule: any, index: number) => {
            return (
              <div
                className={`schedule-setting__content__before__item ${!schedule.checked && 'disable-time'}`}
                key={`before-${index}`}
              >
                <span className="time">08:00 - 12:00</span>
              </div>
            );
          })}
        </div>
        <div className="schedule-setting__content__after">
          <div className="schedule-setting__content__after__item">Buổi chiều</div>
          {scheduleCheck.map((schedule: any, index: number) => {
            return (
              <div
                className={`schedule-setting__content__after__item ${!schedule.checked && 'disable-time'}`}
                key={`after-${index}`}
              >
                <span className="time">13:30 - 17:30</span>
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
              <IconSVG type={scheduleCheck[0].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
              <IconSVG type={scheduleCheck[1].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
              <IconSVG type={scheduleCheck[2].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
              <IconSVG type={scheduleCheck[3].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
              <IconSVG type={scheduleCheck[4].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
              <IconSVG type={scheduleCheck[5].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
              <IconSVG type={scheduleCheck[6].checked ? 'checkbox-active' : 'checkbox-inactive'} />
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
