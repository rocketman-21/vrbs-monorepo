import { FieldConfig, useField } from "formik";
import omit from "lodash/omit";
import { ComponentProps, forwardRef, ForwardRefExoticComponent } from "react";
import { TextInput } from "../../atoms/TextInput/TextInput";

type FormTextInputProps = ComponentProps<typeof TextInput> & Pick<FieldConfig, "validate">;

export const FormTextInput: ForwardRefExoticComponent<FormTextInputProps> = forwardRef<
  HTMLInputElement,
  FormTextInputProps
>((props, ref) => {
  const [field, meta] = useField(omit(props, ["size"]));

  return (
    <TextInput
      {...field}
      {...props}
      error={meta.touched && meta.error ? meta.error : undefined}
      ref={ref}
    />
  );
});

FormTextInput.displayName = "FormTextInput";

export default FormTextInput;
