import React, { useState } from "react";
import {
  Popconfirm,
  Flex,
  Select,
  Typography,
  Form,
  Card,
  List,
  Image,
  Progress,
  Badge,
  Modal,
  Upload,
  Button,
  message
} from "antd";
import {
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

export default function DesktopLayout({
  openModal,
  setOpenModal,
  policyId,
  setPolicyId,
  files = [],
  selectedFiles = [],
  onFileSelect,
  onFileDelete,
  onCancelDelete,
  isUploading,
  uploadProgress,
  activeDirectives = [],
  activeInstructions = [],
  disposalsActive = [],
  setContentInput,
  setContentInputPolicyId
}) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [popconfirmOpen, setPopconfirmOpen] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState({});

  // Политика для выбора (если нужно)
  const handlePolicySelect = (policyId) => {
    setPolicyId(policyId);
  };

  // Превью изображения
  const handlePreview = async (file) => {
    if (file.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        setPreviewImage(reader.result);
        setPreviewTitle(file.name);
      };
    } else if (file.attachmentMimetype?.startsWith('image/')) {
      setPreviewImage(`${file.attachmentPath}`);
      setPreviewTitle(file.originalName);
    }
  };

  // Валидация перед загрузкой
  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Файл должен быть меньше 10MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  // Обработка выбора файлов через Upload
  const handleUploadChange = (info) => {
    const newFiles = info.fileList
      .filter(file => file.originFileObj && file.status !== 'error')
      .map(file => file.originFileObj);
    
    if (newFiles.length > 0) {
      onFileSelect(newFiles);
    }
  };

  // Удаление файла с подтверждением
  const handleDeleteClick = (fileId, fileName) => {
    Modal.confirm({
      title: 'Удаление файла',
      content: `Вы уверены, что хотите удалить файл "${fileName}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',
      onOk() {
        onFileDelete(fileId);
      }
    });
  };

  // Отмена удаления
  const handleUndoDelete = (fileId) => {
    onCancelDelete(fileId);
  };

  // Закрытие модального окна
  const handleClose = () => {
    if (!isUploading) {
      setPopconfirmOpen(false);
      setOpenModal(false);
    }
  };

  const popconfirmContent = (
    <Flex vertical gap="small">
      <div style={{ width: '100%' }}>
        <Flex vertical gap={20}>
          {/* Выбор политики (если нужно) */}
          <Form form={form}>
            <Form.Item name="policyId" style={{ margin: 0 }}>
              <Select
                placeholder="Выберите политику (опционально)"
                allowClear
                showSearch
                style={{ width: '100%' }}
                onChange={handlePolicySelect}
                value={policyId}
                disabled={isUploading}
              >
                <Option value={null}>Не выбрано</Option>
                {activeDirectives.length > 0 && (
                  <Select.OptGroup label="Директивы">
                    {activeDirectives.map(item => (
                      <Option key={item.id} value={item.id}>{item.policyName}</Option>
                    ))}
                  </Select.OptGroup>
                )}
                {activeInstructions.length > 0 && (
                  <Select.OptGroup label="Инструкции">
                    {activeInstructions.map(item => (
                      <Option key={item.id} value={item.id}>{item.policyName}</Option>
                    ))}
                  </Select.OptGroup>
                )}
                {disposalsActive.length > 0 && (
                  <Select.OptGroup label="Распоряжения">
                    {disposalsActive.map(item => (
                      <Option key={item.id} value={item.id}>{item.policyName}</Option>
                    ))}
                  </Select.OptGroup>
                )}
              </Select>
            </Form.Item>
          </Form>

          {/* Загрузка файлов */}
          <Card
            size="small"
            title="Загрузка файлов"
            style={{ width: '100%' }}
            extra={
              isUploading && (
                <Typography.Text type="secondary">
                  Загрузка... {uploadProgress}%
                </Typography.Text>
              )
            }
          >
            {isUploading ? (
              <div style={{ padding: '20px 0' }}>
                <Progress percent={uploadProgress} status="active" />
                <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
                  Идет загрузка файлов...
                </Typography.Text>
              </div>
            ) : (
              <Dragger
                multiple
                disabled={isUploading}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
                showUploadList={false}
                accept="*/*"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Нажмите или перетащите файлы для загрузки
                </p>
                <p className="ant-upload-hint">
                  Поддерживаются файлы до 10MB
                </p>
              </Dragger>
            )}

            {/* Список новых файлов */}
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Typography.Text strong>Новые файлы:</Typography.Text>
                <List
                  size="small"
                  dataSource={selectedFiles}
                  renderItem={(file) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<PaperClipOutlined />}
                        title={file.name}
                        description={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>

          {/* Загруженные файлы */}
          {files.length > 0 && (
            <Card size="small" title="Прикрепленные файлы">
              <List
                size="small"
                dataSource={files}
                renderItem={(file) => (
                  <List.Item
                    actions={[
                      file.attachmentMimetype?.startsWith('image/') && (
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(file)}
                        />
                      ),
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteClick(file.id, file.originalName)}
                      />
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      avatar={<PaperClipOutlined />}
                      title={file.originalName}
                      description={file.attachmentMimetype}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Превью изображения */}
          <Modal
            open={!!previewImage}
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
        </Flex>
      </div>
    </Flex>
  );

  return (
    <Popconfirm
      placement="topLeft"
      title={null}
      description={popconfirmContent}
      open={popconfirmOpen}
      onOpenChange={(open) => {
        if (!open && !isUploading) {
          setOpenModal(false);
        }
        setPopconfirmOpen(open);
      }}
      okText="Закрыть"
      cancelText={null}
      okButtonProps={{
        disabled: isUploading,
        loading: isUploading
      }}
      icon={null}
      onCancel={handleClose}
      onConfirm={handleClose}
    >
      <Badge
        count={files.length}
        size="small"
        offset={[-5, 5]}
        style={{
          backgroundColor: '#005475',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            padding: '4px',
            display: 'inline-block'
          }}
          onClick={() => setPopconfirmOpen(true)}
        >
          <PaperClipOutlined style={{ fontSize: '18px' }} />
        </div>
      </Badge>
    </Popconfirm>
  );
}