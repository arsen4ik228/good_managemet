import React, { useState, useEffect, useRef } from 'react';
import { Modal, Upload, Button, message, Space, List, Progress } from 'antd';
import { usePostFilesMutation } from "@services";
import { PaperClipOutlined, UploadOutlined, DeleteOutlined, CloseOutlined, PictureOutlined } from '@ant-design/icons';
import icon_attach from '@image/icon_ attach.svg';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 МБ

export const SimpleFileUploadModal = ({setParentFiles}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    
    const [postFiles] = usePostFilesMutation();
    const abortControllerRef = useRef(null); // Для отмены запроса

    // Проверка размера и типа файла
    const isValidFile = (file) => {
        // Проверка размера
        if (file.size > MAX_FILE_SIZE) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            message.error(`Файл "${file.name}" (${fileSizeMB} МБ) превышает максимальный размер 10 МБ`);
            return false;
        }

        // Проверка типа файла
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        const fileType = file.type.toLowerCase();
        
        // Проверяем полные MIME типы
        if (allowedTypes.includes(fileType)) {
            return true;
        }
        
        // Проверяем по категориям (image/, video/)
        if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
            return true;
        }
        
        // Проверяем по расширениям
        const fileName = file.name.toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', 
                                 '.mp4', '.webm', '.mov', '.pdf', '.doc', '.docx'];
        
        return allowedExtensions.some(ext => fileName.endsWith(ext));
    };

    // Функция для создания нового File объекта с префиксом
    const createFileWithPrefix = (file, prefix = '%photo%') => {
        // Создаем новый File объект с измененным именем
        const newFileName = `${prefix}${file.name}`;
        const newFile = new File([file], newFileName, {
            type: file.type,
            lastModified: file.lastModified
        });
        return newFile;
    };

    // Проверяем, является ли файл фото или видео
    const isPhotoOrVideoFile = (file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const fileNameLower = file.name.toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const videoExtensions = ['.mp4', '.webm', '.mov'];
        
        const isImageByExt = imageExtensions.some(ext => fileNameLower.endsWith(ext));
        const isVideoByExt = videoExtensions.some(ext => fileNameLower.endsWith(ext));
        
        return isImage || isVideo || isImageByExt || isVideoByExt;
    };

    // Отмена загрузки
    const cancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        setFileList(prev => prev.map(file => ({
            ...file,
            status: 'done' // Возвращаем исходный статус
        })));
        
        message.info('Загрузка отменена');
    };

    // Обработка Ctrl+V из буфера обмена
    useEffect(() => {
        const handlePaste = async (e) => {
            if (!isModalVisible) return;

            const items = e.clipboardData?.items;
            if (!items || items.length === 0) return;

            const newFiles = [];

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file && isValidFile(file)) { // Используем новую функцию проверки
                        // Проверяем, нужно ли добавлять префикс для вставленных файлов
                        let finalFile = file;
                        let fileName = file.name;
                        
                        if (isPhotoOrVideoFile(file)) {
                            finalFile = createFileWithPrefix(file, '%photo%');
                            fileName = finalFile.name;
                        }
                        
                        const newFile = {
                            uid: `pasted-${Date.now()}-${i}`,
                            name: fileName,
                            status: 'done',
                            originFileObj: finalFile,
                            size: file.size,
                            type: file.type,
                        };
                        newFiles.push(newFile);
                    }
                }
            }

            if (newFiles.length > 0) {
                setFileList(prev => [...prev, ...newFiles]);
                message.success(`Добавлено ${newFiles.length} файл(ов)`);
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [isModalVisible]);

    // Ручная вставка по кнопке
    const handleManualPaste = async () => {
        if (!navigator.clipboard?.read) {
            message.warning('Ваш браузер не поддерживает чтение файлов из буфера');
            return;
        }

        try {
            const clipboardItems = await navigator.clipboard.read();
            const newFiles = [];

            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/') || type.includes('pdf') || type.includes('word')) {
                        try {
                            const blob = await clipboardItem.getType(type);
                            const extension = type.split('/')[1] || 'file';
                            const file = new File([blob], `pasted-${Date.now()}.${extension}`, { type });
                            
                            if (isValidFile(file)) { // Используем новую функцию проверки
                                let finalFile = file;
                                let fileName = file.name;
                                
                                // Для вставленных фото/видео тоже добавляем префикс
                                if (isPhotoOrVideoFile(file)) {
                                    finalFile = createFileWithPrefix(file, '%photo%');
                                    fileName = finalFile.name;
                                }
                                
                                newFiles.push({
                                    uid: `pasted-manual-${Date.now()}-${Math.random()}`,
                                    name: fileName,
                                    status: 'done',
                                    originFileObj: finalFile,
                                    size: blob.size,
                                    type: file.type,
                                });
                            }
                        } catch (err) {
                            console.error('Error getting blob:', err);
                        }
                    }
                }
            }

            if (newFiles.length > 0) {
                setFileList(prev => [...prev, ...newFiles]);
                message.success(`Добавлено ${newFiles.length} файл(ов) из буфера`);
            } else {
                message.info('В буфере нет поддерживаемых файлов');
            }
        } catch (err) {
            message.error('Не удалось прочитать буфер. Проверьте разрешения');
            console.error('Clipboard error:', err);
        }
    };

    // Создаем кастомный input для загрузки файлов (общий)
    const CustomUploadButton = ({ accept, buttonText, icon, btnType = "default", isPhotoVideoButton = false }) => {
        const fileInputRef = React.useRef(null);

        const handleClick = () => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        };

        const handleFileChange = (e) => {
            const files = Array.from(e.target.files || []);
            
            if (files.length === 0) return;
            
            const validFiles = [];
            
            files.forEach(file => {
                if (isValidFile(file)) {
                    // Проверка на дубликаты
                    const isDuplicate = fileList.some(
                        f => f.name === file.name && f.size === file.size
                    );

                    if (!isDuplicate) {
                        let finalFile = file;
                        let fileName = file.name;
                        
                        // Если это кнопка "фото или видео" И файл является фото/видео, добавляем префикс
                        if (isPhotoVideoButton && isPhotoOrVideoFile(file)) {
                            finalFile = createFileWithPrefix(file, '%photo%');
                            fileName = finalFile.name;
                        }
                        
                        validFiles.push({
                            uid: `upload-${Date.now()}-${Math.random()}`,
                            name: fileName,
                            status: 'done',
                            originFileObj: finalFile,
                            size: file.size,
                            type: file.type,
                        });
                    } else {
                        message.warning(`Файл "${file.name}" уже добавлен`);
                    }
                }
                // Сообщение об ошибке уже показывается в функции isValidFile
            });

            if (validFiles.length > 0) {
                setFileList(prev => [...prev, ...validFiles]);
                message.success(`Добавлено ${validFiles.length} файл(ов)`);
            }
            
            e.target.value = '';
        };

        const IconComponent = icon;

        return (
            <>
                <Button
                    icon={icon && <IconComponent />}
                    onClick={handleClick}
                    type={btnType}
                    disabled={isUploading}
                >
                    {buttonText}
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    multiple
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
            </>
        );
    };

    // Удаление файла
    const handleRemoveFile = (fileUid) => {
        if (isUploading) {
            message.warning('Нельзя удалять файлы во время загрузки');
            return;
        }
        
        const fileToRemove = fileList.find(f => f.uid === fileUid);
        if (fileToRemove) {
            setFileList(prev => prev.filter(file => file.uid !== fileUid));
            message.info(`Файл "${fileToRemove.name}" удален`);
        }
    };

    // Проверка, все ли файлы загружены
    const allFilesUploaded = () => {
        return fileList.every(file => file.status === 'done' || file.status === 'success');
    };

    // Очистка всех файлов
    const clearAllFiles = () => {
        if (isUploading) {
            message.warning('Нельзя очищать файлы во время загрузки');
            return;
        }
        
        if (fileList.length > 0) {
            setFileList([]);
            message.info('Все файлы удалены');
        }
    };

    // Загрузка файлов
    const handleFinishUpload = async () => {
        if (fileList.length === 0) {
            message.warning('Добавьте хотя бы один файл');
            return;
        }

        if (!allFilesUploaded() && !isUploading) {
            message.info('Завершите загрузку всех файлов');
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);
            
            // Создаем AbortController для возможности отмены
            abortControllerRef.current = new AbortController();
            
            // Подготавливаем FormData
            const formData = new FormData();
            fileList.forEach((file) => {
                // Передаем файл с уже измененным именем (если был добавлен префикс)
                formData.append("files", file.originFileObj);
            });

            // Симуляция прогресса на случай, если API не поддерживает onUploadProgress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev < 90) {
                        return prev + 5;
                    }
                    return prev;
                });
            }, 500);

            try {
                // Отправляем файлы на сервер
                const response = await postFiles({
                    formData,
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.lengthComputable && progressEvent.total > 0) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(percentCompleted);
                        }
                    },
                    signal: abortControllerRef.current.signal // Передаем сигнал для отмены
                }).unwrap();

                // Останавливаем симуляцию
                clearInterval(progressInterval);
                
                // Устанавливаем 100% при успехе
                setUploadProgress(100);

                // Обновляем статус файлов на успешный
                setFileList(prev => prev.map(file => ({
                    ...file,
                    status: 'success'
                })));

                message.success(`Успешно загружено ${fileList.length} файл(ов)`);
                console.warn(response)
                // setParentFiles(response.map(item => ({
                //     attachment: item 
                // })))
                setParentFiles(response)
                // Небольшая задержка для отображения прогресса 100%
                setTimeout(() => {
                    setIsModalVisible(false);
                    setFileList([]);
                    setIsUploading(false);
                    setUploadProgress(0);
                    abortControllerRef.current = null;
                }, 1000);

            } catch (apiError) {
                clearInterval(progressInterval);
                
                // Проверяем, была ли отмена
                if (apiError?.name === 'AbortError' || apiError?.status === 'ABORTED') {
                    message.info('Загрузка отменена пользователем');
                    setFileList(prev => prev.map(file => ({
                        ...file,
                        status: 'done' // Возвращаем исходный статус
                    })));
                } else {
                    throw apiError;
                }
            } finally {
                clearInterval(progressInterval);
            }

        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            message.error(error?.data?.message || 'Ошибка при загрузке файлов');
            
            // Обновляем статус файлов на ошибку
            setFileList(prev => prev.map(file => ({
                ...file,
                status: 'error'
            })));
            
            setIsUploading(false);
            setUploadProgress(0);
            abortControllerRef.current = null;
        }
    };

    // Форматирование размера файла
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
        return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
    };
    
    console.log(fileList)
    
    return (
        <>
            {/* Иконка для открытия модального окна */}
            <img
                src={icon_attach}
                alt="Добавить файлы"
                onClick={() => setIsModalVisible(true)}
                style={{
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px'
                }}
            />

            <Modal
                title={
                    <div style={{ fontSize: '18px', fontWeight: '500' }}>
                        Загрузка файлов
                    </div>
                }
                open={isModalVisible}
                centered
                width={520}
                onCancel={() => {
                    if (isUploading) {
                        message.warning('Загрузка в процессе. Отмените загрузку сначала');
                        return;
                    }
                    
                    if (!allFilesUploaded() && fileList.length > 0) {
                        message.warning('Завершите загрузку всех файлов');
                        return;
                    }
                    setIsModalVisible(false);
                    setFileList([]);
                }}
                footer={null}
                closable={!isUploading && allFilesUploaded()}
                maskClosable={!isUploading && allFilesUploaded()}
            >
                <Space direction="vertical" style={{ width: '100%', gap: '16px' }}>
                    {/* Кнопки управления */}
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space wrap>
                            {/* Кнопка "Загрузить фото или видео" */}
                            <CustomUploadButton
                                accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov"
                                buttonText="фото или видео"
                                icon={PictureOutlined}
                                btnType="default"
                                isPhotoVideoButton={true}
                            />
                            
                            {/* Кнопка "Выбрать файлы" (все типы файлов) */}
                            <CustomUploadButton
                                accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov,.pdf,.doc,.docx"
                                buttonText="файл"
                                icon={UploadOutlined}
                                btnType="default"
                                isPhotoVideoButton={false}
                            />
                        </Space>

                        <Space>
                            {/* <Button
                                icon={<PaperClipOutlined />}
                                onClick={handleManualPaste}
                                type="default"
                                disabled={isUploading}
                            >
                                Вставить из буфера
                            </Button> */}

                            {fileList.length > 0 && !isUploading && (
                                <Button
                                    danger
                                    onClick={clearAllFiles}
                                >
                                    Очистить всё
                                </Button>
                            )}
                        </Space>
                    </Space>

                    {/* Список файлов */}
                    {fileList.length > 0 && (
                        <div style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '16px',
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#8c8c8c',
                                marginBottom: '12px'
                            }}>
                                Выбрано файлов: {fileList.length}
                            </div>

                            <List
                                dataSource={fileList}
                                renderItem={(file) => (
                                    <List.Item
                                        style={{
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f5f5f5',
                                            alignItems: 'center'
                                        }}
                                        actions={[
                                            <Button
                                                key="delete"
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveFile(file.uid)}
                                                size="small"
                                                disabled={isUploading}
                                            />
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    maxWidth: '300px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {file.name}
                                                </div>
                                            }
                                            description={
                                                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                    {formatFileSize(file.size)} • {file.type || 'неизвестный тип'}
                                                    {file.size > MAX_FILE_SIZE && (
                                                        <span style={{ color: '#ff4d4f', marginLeft: '8px' }}>
                                                            Превышен размер!
                                                        </span>
                                                    )}
                                                    {file.name.startsWith('%photo%') && (
                                                        <span style={{ color: '#1890ff', marginLeft: '8px' }}>
                                                            (фото/видео)
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                        />
                                        {file.status === 'done' && (
                                            <span style={{ color: '#52c41a', fontSize: '16px', marginLeft: '8px' }}>
                                                ✓
                                            </span>
                                        )}
                                        {file.status === 'success' && (
                                            <span style={{ color: '#87d068', fontSize: '16px', marginLeft: '8px' }}>
                                                ✓
                                            </span>
                                        )}
                                        {file.status === 'error' && (
                                            <span style={{ color: '#ff4d4f', fontSize: '16px', marginLeft: '8px' }}>
                                                ✗
                                            </span>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    {/* Информационное сообщение */}
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        textAlign: 'center',
                        padding: '8px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px'
                    }}>
                        Максимальный размер файла: 10 МБ
                        <br />
                        Поддерживаются: изображения, видео, PDF, Word документы
                        <br />
                        <span style={{ fontSize: '11px' }}>
                            Для вставки из буфера: нажмите Ctrl+V
                        </span>
                    </div>

                    {/* Прогресс загрузки и кнопки */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '16px',
                        borderTop: '1px solid #f0f0f0',
                        gap: '12px'
                    }}>
                        {isUploading && (
                            <div style={{ width: '100%' }}>
                                <Progress
                                    percent={uploadProgress}
                                    strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                    }}
                                    status={uploadProgress === 100 ? "success" : "active"}
                                    style={{
                                        width: '100%',
                                        marginBottom: '8px'
                                    }}
                                />
                                <div style={{
                                    fontSize: '12px',
                                    color: '#8c8c8c',
                                    textAlign: 'center'
                                }}>
                                    Загружается {fileList.length} файл(ов)
                                </div>
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            width: '100%',
                            justifyContent: 'center'
                        }}>
                            {isUploading ? (
                                <Button
                                    type="default"
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={cancelUpload}
                                    size="large"
                                    style={{ minWidth: '200px' }}
                                >
                                    Отменить загрузку
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={handleFinishUpload}
                                    disabled={!allFilesUploaded() || fileList.length === 0}
                                    size="large"
                                    style={{ minWidth: '200px' }}
                                >
                                    {fileList.length > 0
                                        ? `Загрузить ${fileList.length} файл(ов)`
                                        : 'Загрузить файлы'
                                    }
                                </Button>
                            )}
                        </div>
                    </div>
                </Space>
            </Modal>
        </>
    );
};