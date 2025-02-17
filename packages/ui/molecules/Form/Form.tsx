"use client";

import { Form as FormikForm, Formik } from "formik";
import { ComponentProps } from "react";
import { FormTextArea } from "./FormTextArea";
import { FormTextInput } from "./FormTextInput";

type Props = ComponentProps<typeof Formik> & {
  className?: string;
  id?: string;
};

export const Form = (props: Props) => {
  const { children, id, className = "", ...rest } = props;
  return (
    <Formik {...rest}>
      {formikProps => (
        <FormikForm className={className} id={id}>
          {typeof children === "function" ? children(formikProps) : children}
        </FormikForm>
      )}
    </Formik>
  );
};

Form.TextInput = FormTextInput;

Form.TextArea = FormTextArea;

export default Form;
