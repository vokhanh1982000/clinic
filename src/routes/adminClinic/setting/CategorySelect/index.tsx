import { Checkbox, Form, FormInstance } from 'antd';
import { useIntl } from 'react-intl';
import IconSVG from '../../../../components/icons/icons';
import { useEffect, useState } from 'react';
import { categoryApi } from '../../../../apis';
import { useQuery } from '@tanstack/react-query';

interface ScheduleSettingParams {
  form: FormInstance;
}

const CheckboxGroup = Checkbox.Group;

export const CategorySelect = (props: ScheduleSettingParams) => {
  const { form } = props;
  const intl = useIntl();
  const [optionCategory, setOptionCategory] = useState<{ value: string; label: string }[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['categoryList'],
    queryFn: () => categoryApi.categoryControllerGetAllCategory(),
  });

  useEffect(() => {
    if (data && data.data) {
      const modifiedData = data.data.map(({ id, name }) => ({ value: id, label: name }));
      setOptionCategory(modifiedData);
    }
  }, [data]);

  return (
    <div className="category-select">
      <div className="category-select__title">
        <div className="category-select__title__label">
          {intl.formatMessage({
            id: 'setting.category.title',
          })}
        </div>
        <div className="line-title"></div>
      </div>
      <div className="category-select__content">
        <Form.Item name="categoryIds">
          <CheckboxGroup options={optionCategory} />
        </Form.Item>
      </div>
    </div>
  );
};
