import React, { useState, useRef, useEffect } from "react";
import classes from "./FilesInput.module.css";
import { baseUrl } from "@helpers/constants";
import { FullScreenImageModal } from "../FullScreanImageModal/FullScreanImageModal";
import { useDeleteFileMutation } from "@services";
import fileWord from "./image/fileWord.svg";
import filePdf from "./image/filePdf.svg";
import fileOther from "./image/fileOther.svg";
import { message } from "antd";

export default function FilesInput({ files, setFiles }) {
    const [openFullImageModal, setOpenFullImageModal] = useState(false);
    const [imgUrl, setImgUrl] = useState(null);
    const [scrollClasses, setScrollClasses] = useState("");
    const scrollContainerRef = useRef(null);

    const [deleteFile] = useDeleteFileMutation();


    // Функция для определения иконки в зависимости от расширения файла
    const getFileIcon = (fileName) => {
        if (fileName?.endsWith(".pdf")) {
            return filePdf;
        } else if (fileName?.endsWith(".docx") || fileName?.endsWith(".doc")) {
            return fileWord;
        } else {
            return fileOther;
        }
    };

    const handleImageClick = (url) => {
        setImgUrl(baseUrl + url);
        setOpenFullImageModal(true);
    };

    // Проверяем, является ли вложение изображением
    const isImage = (item) => {
        return item?.attachmentMimetype?.startsWith("image/");
    };

    // Обработчик скролла для показа/скрытия теней
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // Порог для определения "скролла до конца" (несколько пикселей для погрешности)
        const threshold = 1;

        let newClasses = [];

        // Показываем левую тень, если прокрутили вправо
        if (scrollLeft > threshold) {
            newClasses.push(classes["scroll-left"]);
        }

        // Показываем правую тень, если есть контент справа
        if (scrollLeft + clientWidth < scrollWidth - threshold) {
            newClasses.push(classes["scroll-right"]);
        }

        setScrollClasses(newClasses.join(" "));
    };

    const handleDeleteFile = async (id) => {
        try {
            // Вызываем API
            const response = await deleteFile({ id });

            // Проверяем успешный ответ
            if (response?.success || response?.status === 200 || response) {
                // Удаляем файл из состояния
                setFiles(prev => prev.filter(item => item?.id !== id));

                // Показываем сообщение об успехе
                message.success('Файл успешно удален');
            } else {
                throw new Error('Не удалось удалить файл');
            }
        } catch (err) {
            // Более информативная обработка ошибок
            console.error('Ошибка при удалении файла:', err);
            message.error(err?.message || err || 'Произошла ошибка при удалении файла');
        }
    }

    // Проверяем начальное состояние и подписываемся на события
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            // Проверяем сразу после рендера
            const checkScroll = () => {
                requestAnimationFrame(() => {
                    handleScroll();
                });
            };

            checkScroll();

            // Подписываемся на события скролла
            container.addEventListener("scroll", handleScroll);

            // Также проверяем при изменении размера окна
            const handleResize = () => {
                checkScroll();
            };

            window.addEventListener("resize", handleResize);

            // Проверяем при изменении файлов
            checkScroll();

            return () => {
                container.removeEventListener("scroll", handleScroll);
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [files]); // Перепроверяем при изменении файлов

    return (
        <div className={classes.container}>
            {/* Горизонтальный контейнер для всех вложений */}
            {files?.length > 0 && (
                <div
                    ref={scrollContainerRef}
                    className={`${classes.attachmentsHorizontal} ${scrollClasses}`}
                >
                    {files.map((item, idx) => {
                        const isImg = isImage(item);
                        const url = `${baseUrl}${item?.attachmentPath}`;
                        const name = item?.originalName;

                        return (
                            <div key={idx} className={classes.attachmentItem}>
                                <div className={classes.attachmentWrapper}>
                                    {isImg ? (
                                        // Изображение
                                        <div className={classes.imageContainer}>
                                            {/* Контейнер для изображения с кнопкой удаления */}
                                            <div className={classes.imageWithDelete}>
                                                <div
                                                    className={classes.imageWrapper}
                                                    onClick={() => handleImageClick(item?.attachmentPath)}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={name}
                                                        className={classes.attachmentImage}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = fileOther;
                                                        }}
                                                    />
                                                </div>
                                                {/* Кнопка удаления (только при наведении) */}
                                                <button
                                                    className={classes.deleteButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Предотвращаем открытие изображения
                                                        handleDeleteFile(item?.id);
                                                    }}
                                                    title="Удалить"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <span className={classes.fileName}>{name}</span>
                                        </div>
                                    ) : (
                                        // Файл
                                        <div className={classes.fileContainer}>
                                            {/* Контейнер для файла с кнопкой удаления */}
                                            <div className={classes.fileWithDelete}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={classes.fileLink}
                                                    download={name}
                                                >
                                                    <img
                                                        src={getFileIcon(name)}
                                                        alt="file icon"
                                                        className={classes.fileIcon}
                                                    />
                                                </a>
                                                {/* Кнопка удаления (только при наведении) */}
                                                <button
                                                    className={classes.deleteButton}
                                                    onClick={() => handleDeleteFile(item?.id)}
                                                    title="Удалить"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <span className={classes.fileName}>{name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {openFullImageModal && (
                <FullScreenImageModal
                    imageUrl={imgUrl}
                    onClose={() => setOpenFullImageModal(false)}
                />
            )}
        </div>
    );
}