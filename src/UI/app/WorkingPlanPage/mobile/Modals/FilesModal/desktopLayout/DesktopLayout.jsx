import React from "react";
import classes from "./DesktopLayout.module.css";

import { Popconfirm, Flex, Button, Select, Typography } from "antd";

import attachIcon from "@Custom/icon/subbar _ attach.svg";

import { baseUrl } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers";

export default function DesktopLayout({
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
    <Popconfirm
      placement="topLeft"
      description={
        <Flex vertical gap={"small"}>
          <div className={classes.content}>
            <Flex vertical gap={10}>
              <Typography>Прикрепите политику</Typography>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  ...(activeDirectives?.map((item) => ({
                    label: item.policyName,
                    value: item.id,
                  })) || []),
                  ...(activeInstructions?.map((item) => ({
                    label: item.policyName,
                    value: item.id,
                  })) || []),
                ]}
              />
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }} // Скрываем input
                onChange={handleFileChange}
              />
              <Button onClick={handleCustomButtonClick}>Выберите файлы</Button>
            </Flex>

            {/* <select
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
            </select> */}

            {/* Input для выбора файлов */}
            {/* <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }} // Скрываем input
              onChange={handleFileChange}
            /> */}

            {/* Кастомная кнопка */}

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
        </Flex>
      }
      okText="Сохранить"
      onConfirm={handleUpload}
      icon={null}
      cancelButtonProps={{ style: { display: "none" } }} // Убираем кнопку "Отмена"
    >
      <img src={attachIcon} alt="attachIcon" />
    </Popconfirm>
  );
}
