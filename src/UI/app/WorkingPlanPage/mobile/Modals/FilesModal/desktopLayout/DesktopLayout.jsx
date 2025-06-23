import React, { useEffect, useState } from "react";
import classes from "./DesktopLayout.module.css";
import {
  Popconfirm,
  Flex,
  Select,
  Typography,
  Form,
  Button,
  List,
  Upload,
  Card,
  Image,
  message
} from "antd";
import {
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import attachIcon from "@Custom/icon/subbar _ attach.svg";
import { baseUrl } from "@helpers/constants";
import { notEmpty } from "@helpers/helpers";

const { Option } = Select;
const { Dragger } = Upload;

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
  selectedFiles,
  setSelectedFiles,
  deleteFile,
  setDeleteFile,
  setContentInput,
  setContentInputPolicyId
}) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file) => {
    if (file.originFileObj) {
      const preview = await getBase64(file.originFileObj);
      setPreviewImage(preview);
      setPreviewTitle(file.name);
    } else if (file.attachmentMimetype?.startsWith('image/')) {
      setPreviewImage(`${baseUrl}${file.attachmentPath}`);
      setPreviewTitle(file.attachmentName);
    } else {
      message.info('Превью доступно только для изображений');
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Файл должен быть меньше 10MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleFileListChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-5);
    setSelectedFiles(fileList.map(file => file.originFileObj || file));
  };

  const handleRemoveSelectedFile = (file) => {
    const newFiles = selectedFiles.filter(f => f.uid !== file.uid);
    setSelectedFiles(newFiles);
  };

  return (
    <Popconfirm
      placement="topLeft"
      description={
        <Flex vertical gap={"small"}>
          <div className={classes.content}>
            <Flex vertical gap={20}>
              <Typography style={{ fontWeight: '600' }}>Прикрепите политику</Typography>

              <Form form={form}>
                <Form.Item name="policyId" style={{ margin: 0 }}>
                  <Select
                    placement="topLeft"
                    allowClear
                    showSearch
                    style={{ width: '500px' }}
                    optionFilterProp="label"
                  >
                    <Option className={classes.notSelectOption} value="null">Не выбрано</Option>
                    <Select.OptGroup className={classes.optGroup} label="Директивы">
                      {activeDirectives.map((item) => (
                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                      ))}
                    </Select.OptGroup>
                    <Select.OptGroup className={classes.optGroup} label="Инструкции">
                      {activeInstructions.map((item) => (
                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                      ))}
                    </Select.OptGroup>
                  </Select>
                </Form.Item>
              </Form>

              {/* Новый блок для загрузки файлов */}
              <Card
                size="small"
                title="Прикрепленные файлы"
                style={{ width: 500 }}
              >
                <Dragger
                  multiple
                  fileList={selectedFiles}
                  beforeUpload={beforeUpload}
                  onChange={handleFileListChange}
                  showUploadList={false}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">Нажмите или перетащите файлы</p>
                  <p className="ant-upload-hint">Поддерживаются файлы до 10MB</p>
                </Dragger>

                {/* Список выбранных файлов */}
                {selectedFiles.length > 0 && (
                  <List
                    size="small"
                    dataSource={selectedFiles}
                    renderItem={(file, index) => (
                      <List.Item
                        actions={[
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => handleRemoveSelectedFile(file)}
                          />
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<PaperClipOutlined />}
                          title={file.name}
                          description={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                      </List.Item>
                    )}
                  />
                )}

                {/* Список уже загруженных файлов */}
                {files?.length > 0 && (
                  <List
                    size="small"
                    dataSource={files.filter(file => !deleteFile.includes(file.id))}
                    renderItem={(file) => (
                      <List.Item
                        actions={[
                          file.attachmentMimetype.startsWith('image/') && (
                            <Button
                              icon={<EyeOutlined />}
                              type="text"
                              onClick={() => handlePreview(file)}
                            />
                          ),
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => setDeleteFile(prev => [...prev, file.id])}
                          />
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<PaperClipOutlined />}
                          title={file.attachmentName}
                          description={file.attachmentMimetype}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Flex>
          </div>
        </Flex>
      }
      okText="Сохранить"
      onConfirm={handleUpload}
      icon={null}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <img src={attachIcon} alt="attachIcon" />
    </Popconfirm>
  );
}