import { Checkbox, Form, FormInstance } from 'antd';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../apis';

interface ScheduleSettingParams {
  form: FormInstance;
  className?: string;
}

const CheckboxGroup = Checkbox.Group;

export const CategoryCheckbox = (props: ScheduleSettingParams) => {
  const { form, className } = props;
  const intl = useIntl();
  const [optionCategory, setOptionCategory] = useState<{ value: string; label: any }[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['categoryList'],
    queryFn: () => categoryApi.categoryControllerGetAllCategory(),
  });

  useEffect(() => {
    if (data && data.data) {
      const modifiedData = data.data.map(({ id, name, icon }) => ({
        value: id,
        label: (
          <div className="custom-label-checkbox">
            {icon && <img src={process.env.REACT_APP_URL_IMG_S3 + icon.preview} />}
            {name}
          </div>
        ),
      }));
      setOptionCategory(modifiedData);
    }
  }, [data]);

  return (
    <div className={`category-checkbox ${className}`}>
      <div className="category-checkbox__title">
        <div className="category-checkbox__title__label">
          {intl.formatMessage({
            id: 'setting.category.title',
          })}
        </div>
        <div className="line-title"></div>
      </div>
      <div className="category-checkbox__content">
        <Form.Item name="categoryIds">
          <CheckboxGroup options={optionCategory} />
        </Form.Item>
      </div>
    </div>
  );
};
