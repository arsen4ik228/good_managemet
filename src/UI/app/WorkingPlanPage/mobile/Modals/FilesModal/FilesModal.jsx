import React, { useState, useRef, useEffect } from "react";
import { message } from 'antd';
import { usePostFilesMutation, useDeleteFileMutation } from "@services";
import { usePolicyHook, useGetReduxOrganization } from "@hooks";
import DesktopLayout from "./desktopLayout/DesktopLayout";

export default function FilesModal({
  openModal,
  setOpenModal,
  policyId,
  setPolicyId,
  files = [],
  setFiles,
  setUnpinFiles,
  setContentInput,
  setContentInputPolicyId,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [postFiles] = usePostFilesMutation();
  // const [deleteFile] = useDeleteFileMutation();
  
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();
  const { activeDirectives, activeInstructions, disposalsActive } = usePolicyHook({
    organizationId: reduxSelectedOrganizationId
  });

  // Обработка загрузки новых файлов
  useEffect(() => {
    const uploadSelectedFiles = async () => {
      if (selectedFiles.length > 0 && !isUploading) {
        setIsUploading(true);
        
        try {
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

          // Добавляем новые файлы
          setFiles(prev => [...(prev || []), ...response]);
          setSelectedFiles([]);
          
          message.success("Файлы успешно загружены!");
        } catch (error) {
          message.error(`Ошибка при загрузке: ${error.data?.message || error.message}`);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
    };

    uploadSelectedFiles();
  }, [selectedFiles, isUploading, postFiles, setFiles]);

  // Обработка удаления файлов
  useEffect(() => {
    const deleteSelectedFiles = async () => {
      if (filesToDelete.length > 0) {
        try {
          for (const fileId of filesToDelete) {
            // await deleteFile({ fileId }).unwrap();
          }
          
          // Обновляем список файлов, удаляя те, которые были удалены
          setFiles(prev => prev.filter(file => !filesToDelete.includes(file.id)));
          setFilesToDelete([]);
          
          message.success("Файлы успешно удалены!");
        } catch (error) {
          message.error(`Ошибка при удалении: ${error.data?.message || error.message}`);
        }
      }
    };

    deleteSelectedFiles();
  }, [filesToDelete, setFiles]); //deleteFile

  // Обработчик изменения выбранных файлов
  const handleFileSelect = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Обработчик удаления файла
  const handleFileDelete = (fileId) => {
    setFilesToDelete(prev => [...prev, fileId]);
  };

  // Отмена удаления файла
  const handleCancelDelete = (fileId) => {
    setFilesToDelete(prev => prev.filter(id => id !== fileId));
  };

  return (
    <DesktopLayout
      openModal={openModal}
      setOpenModal={setOpenModal}
      policyId={policyId}
      setPolicyId={setPolicyId}
      
      // Файлы
      files={files.filter(file => !filesToDelete.includes(file.id))}
      selectedFiles={selectedFiles}
      
      // Обработчики
      onFileSelect={handleFileSelect}
      onFileDelete={handleFileDelete}
      onCancelDelete={handleCancelDelete}
      
      // Состояние загрузки
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      
      // Политики
      activeDirectives={activeDirectives}
      activeInstructions={activeInstructions}
      disposalsActive={disposalsActive}
      
      // Дополнительные обработчики
      setContentInput={setContentInput}
      setContentInputPolicyId={setContentInputPolicyId}
    />
  );
}