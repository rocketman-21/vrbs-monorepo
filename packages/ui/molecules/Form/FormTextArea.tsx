import { TextArea } from "../../atoms/TextArea";
import { useField } from "formik";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof TextArea>;

export const FormTextArea = (props: Props) => {
  const { size, ref, autosize, onChange, onCopy, onSubmit, ...rest } = props;
  const [field, meta] = useField(rest);

  return (
    <TextArea {...field} {...props} error={meta.touched && meta.error ? meta.error : undefined} />
  );
};
