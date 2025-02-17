"use client";

import clsx from "classnames";
import { ChangeEvent, HTMLProps } from "react";
import { toast } from "../organisms/Notifications";

export const FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface Props extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
  onChange: (files: File[]) => void;
  maxFileSize?: number;
}

export const FileInput = (props: Props) => {
  const { children, className = "", onChange, maxFileSize = FILE_SIZE, disabled, ...rest } = props;

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);

    if (files.some(({ size }) => size > maxFileSize)) {
      toast.error(`Files larger than ${maxFileSize / 1024 / 1024} MB are unsupported`);
    }

    onChange(files.filter(({ size }) => size <= maxFileSize));
  };

  return (
    <label
      className={clsx(className, { "cursor-pointer": !disabled, "cursor-not-allowed": disabled })}
    >
      {children}
      <input type="file" className="hidden" onChange={handleChange} disabled={disabled} {...rest} />
    </label>
  );
};

export default FileInput;
