import React, { useState, useRef } from "react";
import classes from "./FilesModal.module.css";
import ModalContainer from "@Custom/ModalContainer/ModalContainer";
import { usePolicyHook, useGetReduxOrganization } from "@hooks";
import { usePostFilesMutation } from "@services";
import { baseUrl } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers";
import { isMobile } from "react-device-detect";
import DesktopLayout from "./desktopLayout/DesktopLayout";
import {
  message,
} from 'antd';

export default function FilesModal({
  openModal,
  setOpenModal,
  policyId,
  setPolicyId,
  postOrganizationId,
  files,
  setFiles,
  setUnpinFiles,
  organizationId,
  setContentInput,
  setContentInputPolicyId,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [postFiles] = usePostFilesMutation();
  const [deleteFile, setDeleteFile] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const {reduxSelectedOrganizationId} = useGetReduxOrganization()
  const { activeDirectives, activeInstructions, disposalsActive } = usePolicyHook({
    organizationId: reduxSelectedOrganizationId
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const response = await postFiles({
          formData,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }).unwrap();

        setFiles(prev => [...(prev || []), ...response]);

      }

      setSelectedFiles([]);
      setOpenModal(false);
      message.success("Изменения успешно сохранены!");
    } catch (error) {
      message.error(`Произошла ошибка при сохранении: ${error.data.message}`);
      console.error(error.data);
    } finally {
      setIsUploading(false);

    }
  };

  return (
    <>
      <DesktopLayout
        setOpenModal={setOpenModal}
        policyId={policyId}
        setPolicyId={setPolicyId}
        files={files}
        handleUpload={handleUpload}
        activeDirectives={activeDirectives}
        activeInstructions={activeInstructions}
        disposalsActive={disposalsActive}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        deleteFile={deleteFile}
        setDeleteFile={setDeleteFile}
        setContentInput={setContentInput}
        setContentInputPolicyId={setContentInputPolicyId}
        isUploading={isUploading} // статус загрузки можно юзать в некст 
        uploadProgress={uploadProgress} // статус загрузки можно юзать в некст 
      />
    </>
  );
}