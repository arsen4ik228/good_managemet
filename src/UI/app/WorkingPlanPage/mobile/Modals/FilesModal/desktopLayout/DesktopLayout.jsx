// import React, { useEffect, useState } from "react";
// import classes from "./DesktopLayout.module.css";
// import {
//   Modal,
//   Popconfirm,
//   Flex,
//   Select,
//   Typography,
//   Form,
//   Button,
//   List,
//   Upload,
//   Card,
//   Image,
//   message
// } from "antd";
// import {
//   UploadOutlined,
//   PaperClipOutlined,
//   DeleteOutlined,
//   EyeOutlined
// } from '@ant-design/icons';
// import attachIcon from "@Custom/icon/subbar _ attach.svg";
// import { baseUrl } from "@helpers/constants";
// import { notEmpty } from "@helpers/helpers";

// const { Option } = Select;
// const { Dragger } = Upload;

// export default function DesktopLayout({
//   setOpenModal,
//   policyId,
//   setPolicyId,
//   files,
//   handleUpload,
//   activeDirectives,
//   activeInstructions,
//   disposalsActive,
//   fileInputRef,
//   handleFileChange,
//   selectedFiles,
//   setSelectedFiles,
//   deleteFile,
//   setDeleteFile,
//   setContentInput,
//   setContentInputPolicyId
// }) {
//   const [form] = Form.useForm();
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');

//   const handlePreview = async (file) => {
//     if (file.originFileObj) {
//       const preview = await getBase64(file.originFileObj);
//       setPreviewImage(preview);
//       setPreviewTitle(file.name);
//     } else if (file.attachmentMimetype?.startsWith('image/')) {
//       setPreviewImage(`${baseUrl}${file.attachmentPath}`);
//       setPreviewTitle(file.originalName);
//     } else {
//       message.info('Превью доступно только для изображений');
//     }
//   };

//   const getBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   const beforeUpload = (file) => {
//     const isLt10M = file.size / 1024 / 1024 < 10;
//     if (!isLt10M) {
//       message.error('Файл должен быть меньше 10MB!');
//       return Upload.LIST_IGNORE;
//     }
//     return false;
//   };

//   const handleFileListChange = (info) => {
//     let fileList = [...info.fileList];
//     fileList = fileList.slice(-5);
//     setSelectedFiles(fileList.map(file => file.originFileObj || file));
//   };

//   const handleRemoveSelectedFile = (file) => {
//     const newFiles = selectedFiles.filter(f => f.uid !== file.uid);
//     setSelectedFiles(newFiles);
//   };

//   const handlePolicySelect = (policyId) => {
//     setPolicyId(policyId);
//   }

//   return (
//     <Popconfirm
//       placement="topLeft"
//       description={
//         <Flex vertical gap={"small"}>
//           <div className={classes.content}>
//             <Flex vertical gap={20}>
//               <Typography style={{ fontWeight: '600' }}>Прикрепите политику</Typography>

//               <Form form={form}>
//                 <Form.Item name="policyId" style={{ margin: 0 }}>
//                   <Select
//                     placement="topLeft"
//                     allowClear
//                     showSearch
//                     style={{ width: '500px' }}
//                     optionFilterProp="label"
//                     onChange={handlePolicySelect}
//                   >
//                     <Option className={classes.notSelectOption} value="null">Не выбрано</Option>
//                     {activeDirectives.length > 0 && (
//                       <Select.OptGroup className={classes.optGroup} label="Директивы">
//                         {activeDirectives
//                           .slice()
//                           .sort((a, b) => a.policyName.localeCompare(b.policyName))
//                           .map((item) => (
//                             <Option key={item.id} value={item.id}>{item.policyName}</Option>
//                           ))}
//                       </Select.OptGroup>
//                     )}

//                     {activeInstructions.length > 0 && (
//                       <Select.OptGroup className={classes.optGroup} label="Инструкции">

//                         {activeInstructions.slice() // создаем копию массива чтобы не мутировать оригинал
//                           .sort((a, b) => a.policyName.localeCompare(b.policyName)) // сортировка по алфавиту
//                           .map((item) => (
//                             <Option key={item.id} value={item.id}>{item.policyName}</Option>
//                           ))}
//                       </Select.OptGroup>
//                     )}

//                     {disposalsActive.length > 0 && (
//                       <Select.OptGroup className={classes.optGroup} label="Распоряжения">
//                         {disposalsActive
//                           .slice() // создаем копию массива чтобы не мутировать оригинал
//                           .sort((a, b) => a.policyName.localeCompare(b.policyName)) // сортировка по алфавиту
//                           .map((item) => (
//                             <Option key={item.id} value={item.id}>{item.policyName}</Option>
//                           ))}
//                       </Select.OptGroup>
//                     )}

//                   </Select>
//                 </Form.Item>
//               </Form>

//               {/* Новый блок для загрузки файлов */}
//               <Card
//                 size="small"
//                 title="Прикрепленные файлы"
//                 style={{ width: 500 }}
//               >
//                 <Dragger
//                   multiple
//                   fileList={selectedFiles}
//                   beforeUpload={beforeUpload}
//                   onChange={handleFileListChange}
//                   showUploadList={false}
//                 >
//                   <p className="ant-upload-drag-icon">
//                     <UploadOutlined />
//                   </p>
//                   <p className="ant-upload-text">Нажмите или перетащите файлы</p>
//                   <p className="ant-upload-hint">Поддерживаются файлы до 10MB</p>
//                 </Dragger>

//                 {/* Список выбранных файлов */}
//                 {selectedFiles.length > 0 && (
//                   <List
//                     size="small"
//                     dataSource={selectedFiles}
//                     renderItem={(file, index) => (
//                       <List.Item
//                         actions={[
//                           file.type.startsWith('image/') && (
//                             <Button
//                               icon={<EyeOutlined />}
//                               type="text"
//                               onClick={() => handlePreview({ originFileObj: file, name: file.name })}
//                             />
//                           ),
//                           <Button
//                             icon={<DeleteOutlined />}
//                             type="text"
//                             danger
//                             onClick={() => handleRemoveSelectedFile(file)}
//                           />
//                         ]}
//                       >
//                         <List.Item.Meta
//                           avatar={<PaperClipOutlined />}
//                           title={file.name}
//                           description={`${(file.size / 1024).toFixed(2)} KB`}
//                         />
//                       </List.Item>
//                     )}
//                   />
//                 )}

//                 {/* Список уже загруженных файлов */}
//                 {files?.length > 0 && (
//                   <List
//                     size="small"
//                     dataSource={files.filter(file => !deleteFile.includes(file.id))}
//                     renderItem={(file) => (
//                       <List.Item
//                         actions={[
//                           file.attachmentMimetype.startsWith('image/') && (
//                             <Button
//                               icon={<EyeOutlined />}
//                               type="text"
//                               onClick={() => handlePreview(file)}
//                             />
//                           ),
//                           <Button
//                             icon={<DeleteOutlined />}
//                             type="text"
//                             danger
//                             onClick={() => setDeleteFile(prev => [...prev, file.id])}
//                           />
//                         ]}
//                       >
//                         <List.Item.Meta
//                           avatar={<PaperClipOutlined />}
//                           title={file.originalName}
//                         />
//                       </List.Item>
//                     )}
//                   />
//                 )}
//               </Card>
//               <Modal
//                 visible={!!previewImage}
//                 title={previewTitle}
//                 footer={null}
//                 onCancel={() => setPreviewImage('')}
//                 width="80%"
//               >
//                 <Image
//                   alt={previewTitle}
//                   style={{ width: '100%' }}
//                   src={previewImage}
//                 />
//               </Modal>
//             </Flex>
//           </div>
//         </Flex>
//       }
//       okText="Сохранить"
//       onConfirm={handleUpload}
//       icon={null}
//       cancelButtonProps={{ style: { display: "none" } }}
//     >
//       <img src={attachIcon} alt="attachIcon" />
//     </Popconfirm>
//   );
// }


import React, { useEffect, useState } from "react";
import classes from "./DesktopLayout.module.css";
import {
  Modal,
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
  message,
  Progress,
  Badge
} from "antd";
import {
  UploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined
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
  activeDirectives,
  activeInstructions,
  disposalsActive,
  fileInputRef,
  handleFileChange,
  selectedFiles,
  setSelectedFiles,
  deleteFile,
  setDeleteFile,
  setContentInput,
  setContentInputPolicyId,
  isUploading,
  uploadProgress
}) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [popconfirmOpen, setPopconfirmOpen] = useState(false);

  const handlePreview = async (file) => {
    if (file.originFileObj) {
      const preview = await getBase64(file.originFileObj);
      setPreviewImage(preview);
      setPreviewTitle(file.name);
    } else if (file.attachmentMimetype?.startsWith('image/')) {
      setPreviewImage(`${baseUrl}${file.attachmentPath}`);
      setPreviewTitle(file.originalName);
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

    // Фильтруем только новые файлы (те, у которых есть originFileObj)
    const newFiles = fileList
      .filter(file => file.originFileObj)
      .map(file => file.originFileObj);

    if (newFiles.length > 0) {
      setSelectedFiles(newFiles);
    }
  };

  const handleRemoveSelectedFile = (file) => {
    const newFiles = selectedFiles.filter(f => f.uid !== file.uid);
    setSelectedFiles(newFiles);
  };

  const handlePolicySelect = (policyId) => {
    setPolicyId(policyId);
  }

  const handlePopconfirmOpenChange = (open) => {
    setPopconfirmOpen(open);
    if (!open) {
      setOpenModal(false);
    }
  };

  // Закрываем Popconfirm после завершения загрузки
  useEffect(() => {
    if (!isUploading && selectedFiles.length === 0 && popconfirmOpen) {
      // Не закрываем автоматически, пусть пользователь сам закроет
      // setPopconfirmOpen(false);
      // setOpenModal(false);
    }
  }, [isUploading, selectedFiles.length, popconfirmOpen, setOpenModal]);

  const popconfirmContent = (
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
                onChange={handlePolicySelect}
                placeholder="Выберите политику"
              >
                <Option className={classes.notSelectOption} value="null">Не выбрано</Option>
                {activeDirectives.length > 0 && (
                  <Select.OptGroup className={classes.optGroup} label="Директивы">
                    {activeDirectives
                      .slice()
                      .sort((a, b) => a.policyName.localeCompare(b.policyName))
                      .map((item) => (
                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                      ))}
                  </Select.OptGroup>
                )}

                {activeInstructions.length > 0 && (
                  <Select.OptGroup className={classes.optGroup} label="Инструкции">
                    {activeInstructions
                      .slice()
                      .sort((a, b) => a.policyName.localeCompare(b.policyName))
                      .map((item) => (
                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                      ))}
                  </Select.OptGroup>
                )}

                {disposalsActive.length > 0 && (
                  <Select.OptGroup className={classes.optGroup} label="Распоряжения">
                    {disposalsActive
                      .slice()
                      .sort((a, b) => a.policyName.localeCompare(b.policyName))
                      .map((item) => (
                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                      ))}
                  </Select.OptGroup>
                )}
              </Select>
            </Form.Item>
          </Form>

          {/* Блок для загрузки файлов */}
          <Card
            size="small"
            title="Прикрепленные файлы"
            style={{ width: 500 }}
          >
            {isUploading && (
              <div style={{ marginBottom: 16 }}>
                <Progress percent={uploadProgress} status="active" />
                <Typography.Text type="secondary">
                  Загрузка файлов...
                </Typography.Text>
              </div>
            )}

            <Dragger
              multiple
              fileList={[]}
              beforeUpload={beforeUpload}
              onChange={handleFileListChange}
              showUploadList={false}
              disabled={isUploading}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Нажмите или перетащите файлы</p>
              <p className="ant-upload-hint">Поддерживаются файлы до 10MB</p>
            </Dragger>

            {/* Информация о текущей загрузке */}
            {isUploading && selectedFiles.length > 0 && (
              <List
                size="small"
                style={{ marginTop: 16 }}
                dataSource={selectedFiles}
                renderItem={(file) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<PaperClipOutlined />}
                      title={file.name}
                      description={`Загрузка... ${uploadProgress}%`}
                    />
                  </List.Item>
                )}
              />
            )}

            {/* Список уже загруженных файлов */}
            {files?.length > 0 && (
              <List
                size="small"
                style={{ marginTop: 16 }}
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
                      title={file.originalName}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>

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
  // console.log(files)
  return (
    <Popconfirm
      placement="topLeft"
      title={null}
      description={popconfirmContent}
      open={popconfirmOpen}
      onOpenChange={handlePopconfirmOpenChange}
      okText="Закрыть"
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{
        disabled: isUploading,
        loading: isUploading
      }}
      icon={null}
      showCancel={false}
    >
      <Badge
        count={files?.length || 0}
        size="small"
        offset={[-5, 5]} // Смещение бейджа в правый верхний угол
        style={{
          backgroundColor: '#005475', // Красный цвет для бейджа
        }}
      >
        <img
          src={attachIcon}
          alt="attachIcon"
          style={{ cursor: 'pointer' }}
          onClick={() => setPopconfirmOpen(true)}
        />
      </Badge>
    </Popconfirm>
  );
}