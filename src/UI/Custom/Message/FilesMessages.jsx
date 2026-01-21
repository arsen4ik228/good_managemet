import React, { useState } from "react";
import classes from "./FilesMessages.module.css";
import { baseUrl } from "@helpers/constants";
import { FullScreenImageModal } from "../FullScreanImageModal/FullScreanImageModal";

import file_icon from "@image/file_icon.svg"

export default function FilesMessages({ attachmentToMessage }) {
  const [openFullImageModal, setOpenFullImageModal] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  // Ограничиваем количество файлов до 10
  const displayedAttachments = attachmentToMessage?.slice(0, 10) || [];
  
  // Проверяем, является ли вложение изображением
  const isImage = (item) => {
    return item?.attachment?.attachmentMimetype?.startsWith("image/");
  };

  const handleImageClick = (url) => {
    setImgUrl(baseUrl + url);
    setOpenFullImageModal(true);
  };

  return (
    <div className={classes.container}>
      {displayedAttachments.length > 0 && (
        <div className={classes.attachmentsGrid}>
          {displayedAttachments.map((item, idx) => {
            const isImg = isImage(item);
            const url = `${baseUrl}${item?.attachment?.attachmentPath}`;
            const name = item?.attachment?.originalName;
            
            // Определяем класс для позиционирования элементов во второй строке
            const itemClass = displayedAttachments.length > 7 && idx >= 7 
              ? `${classes.attachmentItem} ${classes.secondRowItem}`
              : classes.attachmentItem;

            return (
              <div key={idx} className={itemClass}>
                <div className={classes.attachmentWrapper}>
                  {isImg ? (
                    // Изображение 52x52
                    <div 
                      className={classes.imageContainer}
                      onClick={() => handleImageClick(item?.attachment?.attachmentPath)}
                    >
                      <img
                        src={url}
                        alt={name}
                        className={classes.attachmentImage}
                        style={{
                          width: '52px',
                          height: '52px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ) : (
                    // Файл с иконкой file_icon
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.fileContainer}
                    >
                      <img
                        src={file_icon}
                        alt="file icon"
                        className={classes.fileIcon}
                      />
                    </a>
                  )}
                  <span className={classes.fileName}>{name}</span>
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