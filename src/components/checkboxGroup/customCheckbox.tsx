import { Checkbox, CheckboxProps, FormInstance } from 'antd';

interface CustomCheckbox extends CheckboxProps {
  array?: any[];
  form: FormInstance<any>;
  formFieldValueName: string;
  listChecked: any[] | undefined;
}

const CheckboxGroupCustom = (props: CustomCheckbox) => {
  let { array, form, formFieldValueName, listChecked } = props;
  listChecked = listChecked?.map((item) => item.id);
  console.log('list: ', listChecked);
  const handeArrayCheckbox = (e: any) => {
    const item = new Set((form.getFieldValue(formFieldValueName) || []) as string[]);
    e.target.checked ? item.add(e.target.value) : item.delete(e.target.value);
    form.setFieldValue(formFieldValueName, Array.from(item));
  };
  return (
    <Checkbox.Group>
      {array?.map((item) => (
        <Checkbox
          value={item.id}
          checked
          onChange={(e) => handeArrayCheckbox(e)}
          className={`ant-custom-checkboxGroup-${item.id}`}
          {...props}
        >
          {item.name}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default CheckboxGroupCustom;
