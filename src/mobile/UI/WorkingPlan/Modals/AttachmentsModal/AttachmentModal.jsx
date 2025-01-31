import React from 'react'
import classes from './AttachmentMOdal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'
import { baseUrl } from '../../../../BLL/constans'

export default function AttachmentModal({attachments}) {
    console.log(attachments)
    return (
        <>
            <ModalContainer>
                <div className={classes.selectedFiles}>
                    {/* {selectedFiles.map((file, index) => (
                        <div key={index} className={classes.fileItem}>
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
                    ))} */}
                    {attachments
                        /* ?.filter((file) => !deleteFile.includes(file.id)) */
                        ?.map((file, index) => (
                            <div key={index} className={classes.fileItem}>
                                {file.attachment.attachmentMimetype.startsWith('image/') ? (
                                    <img
                                        src={baseUrl + file.attachment.attachmentPath} // Создаем временную ссылку для превью
                                        alt={file.name}
                                        className={classes.imagePreview}
                                    />
                                ) : (
                                    <span>{file.attachmentName}</span> // Для не-изображений показываем имя файла
                                )}
                                {/* <button onClick={() => setDeleteFile(prevState => [...prevState, file.id])}>Удалить</button> */}
                            </div>
                        ))}

                </div>
            </ModalContainer>
        </>
    )
}
