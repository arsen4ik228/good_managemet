import React, { useState, useRef } from "react";
import classes from "./FilesModal.module.css";

import ModalContainer from "@Custom/ModalContainer/ModalContainer";
import { usePolicyHook } from "@hooks";
import { usePostFilesMutation } from "@services";
import { baseUrl } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers";

import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
import MobileLayout from "./mobileLayout/MobileLayout";
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
  // console.warn(selectedFiles);

  const { activeDirectives, activeInstructions } = usePolicyHook({
    organizationId
  });

  // console.log("organizationId", organizationId);
  // Обработчик изменения input типа file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Преобразуем FileList в массив
    if (files) {
      setSelectedFiles(files); // Сохраняем выбранные файлы в состоянии
    }
  };

  // Обработчик отправки файлов на сервер
  const handleUpload = async () => {
    if (notEmpty(deleteFile)) setUnpinFiles(deleteFile);

    if (selectedFiles.length === 0) {
      alert("Пожалуйста, выберите файлы для загрузки.");
      return;
    }

    const formData = new FormData(); // Создаем объект FormData
    selectedFiles.forEach((file) => {
      formData.append("files", file); // Добавляем каждый файл в FormData
    });
    // // Проверка содержимого FormData
    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }
    try {
      const response = await postFiles({ formData }).unwrap(); // Вызываем мутацию
      console.log(response);
      setFiles(response);
      setSelectedFiles([]); // Очищаем выбранные файлы после успешной загрузки
      alert("Файлы успешно загружены!");
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
      alert("Произошла ошибка при загрузке файлов.");
    }
  };
  // Обработчик удаления файла из списка выбранных
  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click(); // Программно вызываем клик по input
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
          handleCustomButtonClick={handleCustomButtonClick}
          selectedFiles={selectedFiles}
          handleRemoveFile={handleRemoveFile}
          deleteFile={deleteFile}
          setDeleteFile={setDeleteFile}
          setContentInput={setContentInput}
          setContentInputPolicyId={setContentInputPolicyId}
        ></DesktopLayout>
 
    </>
  );
}
