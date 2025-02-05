import React, { useRef, useState } from 'react'
import classes from './AttachmentMOdal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'
import { baseUrl } from '../../../../BLL/constans'
import { usePostFilesMutation } from '../../../../../desktop/BLL/fileApi'
import { FullScreenImageModal } from '../../../Custom/FullScreanImageModal/FullScreanImageModal'


export default function AttachmentModal({ setOpenModal, attachments, setAttachments, isOrder }) {
    console.log(attachments)

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [postImage] = usePostFilesMutation();
    const fileInputRef = useRef(null);

    const deleteFile = (id) => {
        setAttachments(prevState =>
            prevState.filter(item => item.id !== id)
        )
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Преобразуем FileList в массив
        if (files) {
            setSelectedFiles(files); // Сохраняем выбранные файлы в состоянии
        }
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const handleCustomButtonClick = () => {
        fileInputRef.current.click(); // Программно вызываем клик по input
    };

    const transformResponse = (response) => {
        const newFiles = response.map(item => ({
            attachment: {
                id: item.id,
                attachmentMimetype: item.attachmentMimetype,
                attachmentName: item.attachmentName,
                attachmentPath: item.attachmentPath
            }
        }));

        setAttachments(prevState => [...prevState, ...newFiles]);
    };

    const handleUpload = async () => {


        if (selectedFiles.length === 0) {
            alert('Пожалуйста, выберите файлы для загрузки.');
            return;
        }

        const formData = new FormData(); // Создаем объект FormData
        selectedFiles.forEach((file) => {
            formData.append('files', file); // Добавляем каждый файл в FormData
        });

        try {
            const response = await postImage({ formData }).unwrap(); // Вызываем мутацию
            transformResponse(response);
            console.log(response)
            setSelectedFiles([]); // Очищаем выбранные файлы после успешной загрузки
            alert('Файлы успешно загружены!');
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            alert('Произошла ошибка при загрузке файлов.');
        }
    };

    const clickFunction = () => {
        handleUpload()
        setOpenModal(false)
    }

    const handleImageClick = (imageUrl) => {
        setFullScreenImage(imageUrl);
        console.error('click')
    };

    return (
        <>
            <ModalContainer
                setOpenModal={setOpenModal}
                clickFunction={clickFunction}
                disabledButton={isOrder}
            >
                <div className={classes.selectedFiles}>

                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Скрываем input
                        onChange={handleFileChange}
                    />

                    {!isOrder && (
                        <button className={classes.customFileButton} onClick={handleCustomButtonClick}>
                            Добавить файлы
                        </button>
                    )}

                    {selectedFiles.map((file, index) => (
                        <div key={index} className={classes.fileItem}>
                            {/* Превью изображения */}
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)} // Создаем временную ссылку для превью
                                    alt={file.name}
                                    className={classes.imagePreview}
                                    onClick={() => handleImageClick(URL.createObjectURL(file))}
                                />
                            ) : (
                                <span>{file.name}</span> // Для не-изображений показываем имя файла
                            )}
                            {!isOrder && (
                                <button onClick={() => handleRemoveFile(index)}>Удалить</button>
                            )}
                        </div>
                    ))}

                    {attachments
                        /* ?.filter((file) => !deleteFile.includes(file.id)) */
                        ?.map((file, index) => (
                            <div key={index} className={classes.fileItem}>
                                {file.attachment.attachmentMimetype.startsWith('image/') ? (
                                    <img
                                        src={baseUrl + file.attachment.attachmentPath} // Создаем временную ссылку для превью
                                        alt={file.name}
                                        className={classes.imagePreview}
                                        onClick={() => handleImageClick(baseUrl + file.attachment.attachmentPath)}
                                    />
                                ) : (
                                    <span>{file.attachment.attachmentName}</span> // Для не-изображений показываем имя файла
                                )}
                                {!isOrder && (
                                    <button onClick={() => deleteFile(file.id)}>Удалить</button>
                                )}
                            </div>
                        ))}

                </div>
            </ModalContainer>

            <FullScreenImageModal
                imageUrl={fullScreenImage}
                onClose={() => setFullScreenImage(null)}
            />
        </>
    )
}
