import React, { useState } from 'react';
import {
  Modal,
  Upload,
  Button,
  List,
  Image,
  message,
  Card,
  Spin
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PaperClipOutlined
} from '@ant-design/icons';
import { usePostFilesMutation } from '@services';
import { baseUrl } from '@helpers/constants';
import classes from './AttachmentMOdal.module.css'

const { Dragger } = Upload;

export default function AttachmentModal({
  open,
  setOpen,
  attachments,
  setAttachments,
  isOrder
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [postImage] = usePostFilesMutation();

  const handleCancel = () => setOpen(false);

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Файл должен быть меньше 10MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-5);
    
    setSelectedFiles(fileList.map(file => file.originFileObj || file));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      message.warning('Пожалуйста, выберите файлы для загрузки');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploading(true);
      const response = await postImage({ formData }).unwrap();
      
      const newFiles = response.map(item => ({
        id: item.id, // Добавляем id для корректного удаления
        attachment: {
          id: item.id,
          attachmentMimetype: item.attachmentMimetype,
          attachmentName: item.attachmentName,
          attachmentPath: item.attachmentPath,
          attachmentOriginalName: item.originalName
        }
      }));

      setAttachments(prev => [...prev, ...newFiles]);
      setSelectedFiles([]);
      message.success('Файлы успешно загружены!');
    } catch (error) {
      console.error('Ошибка при загрузке файлов:', error);
      message.error('Произошла ошибка при загрузке файлов');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = (id) => {
    setAttachments(prev => prev.filter(item => item.id !== id));
    message.success('Файл удален');
  };

  const handlePreview = async (file) => {
    // Для новых файлов (еще не загруженных)
    console.log(file)
    if (file.originFileObj) {
      const preview = await getBase64(file.originFileObj);
      setPreviewImage(preview);
      setPreviewTitle(file.name);
    }
    // Для уже загруженных файлов
    else if (file.attachment?.attachmentMimetype?.startsWith('image/')) {
      setPreviewImage(`${baseUrl}${file.attachment.attachmentPath}`);
      setPreviewTitle(file.attachment.originalName);
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

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PaperClipOutlined />
            <span>Управление вложениями</span>
          </div>
        }
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button
            className={classes.cancelButton}
            key="back" onClick={handleCancel}
          >
            Отмена
          </Button>,
          <Button
            className={isOrder || selectedFiles.length === 0 ? '' : classes.loadButton}
            key="submit"
            type="primary"
            onClick={handleUpload}
            loading={uploading}
            disabled={isOrder || selectedFiles.length === 0}
          >
            Загрузить
          </Button>,
        ]}
        width={800}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Spin spinning={uploading}>
          <div style={{ marginBottom: 16 }}>
            <Card
              title="Новые файлы"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Dragger
                multiple
                fileList={selectedFiles}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                showUploadList={false}
                disabled={isOrder}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Нажмите или перетащите файлы для загрузки
                </p>
                <p className="ant-upload-hint">
                  Поддерживаются любые файлы размером до 10MB
                </p>
              </Dragger>

              {selectedFiles.length > 0 && (
                <List
                  size="small"
                  dataSource={selectedFiles}
                  renderItem={(file, index) => (
                    <List.Item
                      actions={[
                        !isOrder && (
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => {
                              const newFiles = [...selectedFiles];
                              newFiles.splice(index, 1);
                              setSelectedFiles(newFiles);
                            }}
                          />
                        ),
                        file.type.startsWith('image/') && (
                          <Button
                            icon={<EyeOutlined />}
                            type="text"
                            onClick={() => handlePreview({ originFileObj: file, name: file.name })}
                          />
                        )
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
            </Card>

            <Card
              title="Загруженные файлы"
              size="small"
            >
              <List
                size="small"
                dataSource={attachments}
                renderItem={(file) => (
                  <List.Item
                    actions={[
                      file.attachment.attachmentMimetype.startsWith('image/') && (
                        <Button
                          icon={<EyeOutlined />}
                          type="text"
                          onClick={() => handlePreview(file)}
                        />
                      ),
                      !isOrder && (
                        <Button
                          icon={<DeleteOutlined />}
                          type="text"
                          danger
                          onClick={() => deleteFile(file.id)}
                        />
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<PaperClipOutlined />}
                      title={file.attachment.originalName}
                      description={file.attachment.attachmentMimetype}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Spin>
      </Modal>

      <Modal
        visible={!!previewImage}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewImage('')}
        width="80%"
      >
        <Image
          alt={previewTitle}
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </>
  );
}