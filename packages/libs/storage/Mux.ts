"use client";

import axios, { AxiosProgressEvent } from "axios";
import { localApi } from "../api/local";

interface UploadProgressCallback {
  (progressEvent: AxiosProgressEvent): void;
}

export const MuxStorage = {
  async directUpload(revolutionId: string) {
    const { data } = await localApi()
      .url("/routes/mux/direct-upload")
      .post({ revolutionId })
      .json<{ data: { id: string; url: string } }>();

    if (!data.id) throw new Error("Couldn't prepare upload");
    return data;
  },

  async upload(file: File, onUploadProgress?: UploadProgressCallback) {
    const { id, url } = await this.directUpload("revolutionId");

    const response = await axios.put(url, file, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    if (response.status !== 200) {
      throw new Error(`Error uploading file: ${response.statusText}`);
    }

    return { muxUploadId: id };
  },
};
