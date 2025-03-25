import React from "react";
import ModalContainer from "@Custom/ModalContainer/ModalContainer";
import classes from "./MobileLayout.module.css";

import attachIcon from "@Custom/icon/subbar _ attach.svg";

import { baseUrl } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers";

export default function MobileLayout({
  openModal,
  setOpenModal,
  policyId,
  setPolicyId,
  files,
  handleUpload,
  activeDirectives,
  activeInstructions,
  fileInputRef,
  handleFileChange,
  handleCustomButtonClick,
  selectedFiles,
  handleRemoveFile,
  deleteFile,
  setDeleteFile,
}) {
  return (
    <>
      <img
        src={attachIcon}
        alt="attachIcon"
        onClick={() => setOpenModal(true)}
      />

      {openModal ? (
        <ModalContainer
          setOpenModal={setOpenModal}
          clickFunction={handleUpload}
        >
          <div className={classes.content}>
            <select
              className={classes.attachPolicy}
              name="attachPolicy"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
            >
              <option>Выберите политику</option>
              {activeDirectives?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.policyName}
                </option>
              ))}
              {activeInstructions?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.policyName}
                </option>
              ))}
            </select>

            {/* Input для выбора файлов */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }} // Скрываем input
              onChange={handleFileChange}
            />

            {/* Кастомная кнопка */}
            <button
              onClick={handleCustomButtonClick}
              className={classes.customFileButton}
            >
              Выберите файлы
            </button>

            {/* Отображение выбранных файлов */}
            {(notEmpty(selectedFiles) || notEmpty(files)) && (
              <div className={classes.selectedFiles}>
                {selectedFiles.map((file, index) => (
                  <div key={index} className={classes.fileItem}>
                    {/* Превью изображения */}
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)} // Создаем временную ссылку для превью
                        alt={file.name}
                        className={classes.imagePreview}
                      />
                    ) : (
                      <span>{file.name}</span> // Для не-изображений показываем имя файла
                    )}
                    <button onClick={() => handleRemoveFile(index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                {files
                  ?.filter((file) => !deleteFile.includes(file.id))
                  .map((file, index) => (
                    <div key={index} className={classes.fileItem}>
                      {file.attachmentMimetype.startsWith("image/") ? (
                        <img
                          src={baseUrl + file.attachmentPath} // Создаем временную ссылку для превью
                          alt={file.name}
                          className={classes.imagePreview}
                        />
                      ) : (
                        <span>{file.attachmentName}</span> // Для не-изображений показываем имя файла
                      )}
                      <button
                        onClick={() =>
                          setDeleteFile((prevState) => [...prevState, file.id])
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </ModalContainer>
      ) : (
        <></>
      )}
    </>
  );
}
