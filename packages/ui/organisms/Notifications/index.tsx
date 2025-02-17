"use client";

import { Toaster } from "react-hot-toast";

export const Notifications = () => {
  return <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />;
};

export default Notifications;

export { default as toast } from "react-hot-toast";
