import React, { useState, useRef } from "react";
import classes from "./FilesModal.module.css";
import ModalContainer from "@Custom/ModalContainer/ModalContainer";
import { usePolicyHook } from "@hooks";
import { usePostFilesMutation } from "@services";
import { baseUrl } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers";
import { isMobile } from "react-device-detect";
import DesktopLayout from "./desktopLayout/DesktopLayout";

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

  const { activeDirectives, activeInstructions } = usePolicyHook({
    organizationId: postOrganizationId
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (notEmpty(deleteFile)) setUnpinFiles(deleteFile);

    if (selectedFiles.length === 0 && deleteFile.length === 0) {
      alert("Нет изменений для сохранения.");
      return;
    }

    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        
        const response = await postFiles({ formData }).unwrap();
        setFiles(prev => [...prev, ...response]);
      }

      setSelectedFiles([]);
      setOpenModal(false);
      alert("Изменения успешно сохранены!");
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при сохранении.");
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
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles} // Добавлено!
        deleteFile={deleteFile}
        setDeleteFile={setDeleteFile}
        setContentInput={setContentInput}
        setContentInputPolicyId={setContentInputPolicyId}
      />
    </>
  );
}