import React, { useState, useRef } from 'react';
import classes from './FilesModal.module.css';
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer';
import { usePolicyHook } from '../../../../hooks/usePolicyHook';
import { usePostFilesMutation } from '../../../../../desktop/BLL/fileApi';
import { baseUrl, notEmpty } from '../../../../BLL/constans';

export default function FilesModal({ setOpenModal, policyId, setPolicyId, postOrganizationId, files, setFiles, setUnpinFiles }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [postImage] = usePostFilesMutation();
    const [deleteFile, setDeleteFile] = useState([])
    const fileInputRef = useRef(null);
    console.warn(selectedFiles)
    const {
        activeDirectives,
        activeInstructions,
    } = usePolicyHook({ organizationId: postOrganizationId });

    // Обработчик изменения input типа file
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Преобразуем FileList в массив
        if (files) {
            setSelectedFiles(files); // Сохраняем выбранные файлы в состоянии
        }
    };

    // Обработчик отправки файлов на сервер
    const handleUpload = async () => {

        if (notEmpty(deleteFile))
            setUnpinFiles(deleteFile)

        if (selectedFiles.length === 0) {
            alert('Пожалуйста, выберите файлы для загрузки.');
            return;
        }

        const formData = new FormData(); // Создаем объект FormData
        selectedFiles.forEach((file) => {
            formData.append('files', file); // Добавляем каждый файл в FormData
        });
        console.log(formData)
        try {
            const response = await postImage({formData}).unwrap(); // Вызываем мутацию
            console.log(response)
            setFiles(response);
            setSelectedFiles([]); // Очищаем выбранные файлы после успешной загрузки
            alert('Файлы успешно загружены!');
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            alert('Произошла ошибка при загрузке файлов.');
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
        <ModalContainer setOpenModal={setOpenModal} clickFunction={handleUpload}>
            <div className={classes.content}>
                <select
                    className={classes.attachPolicy}
                    name="attachPolicy"
                    value={policyId}
                    onChange={(e) => setPolicyId(e.target.value)}
                >
                    <option>Выберите политику</option>
                    {activeDirectives?.map((item, index) => (
                        <option key={index} value={item.id}>{item.policyName}</option>
                    ))}
                    {activeInstructions?.map((item, index) => (
                        <option key={index} value={item.id}>{item.policyName}</option>
                    ))}
                </select>

                {/* Input для выбора файлов */}
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Скрываем input
                    onChange={handleFileChange}
                />

                {/* Кастомная кнопка */}
                <button onClick={handleCustomButtonClick} className={classes.customFileButton}>
                    Выберите файлы
                </button>

                {/* Отображение выбранных файлов */}
                {(notEmpty(selectedFiles) || notEmpty(files)) && (
                    <div className={classes.selectedFiles}>
                        {selectedFiles.map((file, index) => (
                            <div key={index} className={classes.fileItem}>
                                {/* Превью изображения */}
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(file)} // Создаем временную ссылку для превью
                                        alt={file.name}
                                        className={classes.imagePreview}
                                    />
                                ) : (
                                    <span>{file.name}</span> // Для не-изображений показываем имя файла
                                )}
                                <button onClick={() => handleRemoveFile(index)}>Удалить</button>
                            </div>
                        ))}
                        {files
                            ?.filter((file) => !deleteFile.includes(file.id))
                            .map((file, index) => (
                                <div key={index} className={classes.fileItem}>
                                    {file.attachmentMimetype.startsWith('image/') ? (
                                        <img
                                            src={baseUrl + file.attachmentPath} // Создаем временную ссылку для превью
                                            alt={file.name}
                                            className={classes.imagePreview}
                                        />
                                    ) : (
                                        <span>{file.attachmentName}</span> // Для не-изображений показываем имя файла
                                    )}
                                    <button onClick={() => setDeleteFile(prevState => [...prevState, file.id])}>Удалить</button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </ModalContainer >
    );
}