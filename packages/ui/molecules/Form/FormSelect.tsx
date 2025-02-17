import { useField } from "formik";
import { ComponentProps } from "react";
import { Select } from "../../atoms/Select";

type Props = ComponentProps<typeof Select>;

export const FormSelect = (props: Props) => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Select
      {...field}
      {...props}
      onChange={options => {
        helpers.setTouched(true);
        helpers.setValue(Array.isArray(options) ? options.map(o => o.value) : options?.value);
      }}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};
