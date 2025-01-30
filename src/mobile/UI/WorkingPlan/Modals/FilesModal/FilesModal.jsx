import React, { useState } from 'react';
import classes from './FilesModal.module.css';
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer';
import { usePolicyHook } from '../../../../hooks/usePolicyHook';
import { usePostImageMutation } from '../../../../../desktop/BLL/fileApi';

export default function FilesModal({ setOpenModal, policyId, setPolicyId, postOrganizationId, setFilesIds }) {
    const [selectedFiles, setSelectedFiles] = useState([]); // Состояние для хранения выбранных файлов
    const [postImage] = usePostImageMutation(); // Используем мутацию для загрузки файлов

    const {
        activeDirectives,
        activeInstructions,
    } = usePolicyHook({ organizationId: postOrganizationId });

    // Обработчик изменения input типа file
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles([...files]); // Сохраняем выбранные файлы в состоянии
        }
    };

    // Обработчик отправки файлов на сервер
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
            setFilesIds(response)
            console.log('Файлы успешно загружены:', response);
            setSelectedFiles([]); // Очищаем выбранные файлы после успешной загрузки
            alert('Файлы успешно загружены!');
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            alert('Произошла ошибка при загрузке файлов.');
        }
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
                    multiple // Позволяет выбирать несколько файлов
                    onChange={handleFileChange}
                />

                {/* Кнопка для загрузки файлов */}
                {/* <button onClick={handleUpload}>Загрузить файлы</button> */}
            </div>
        </ModalContainer>
    );
}