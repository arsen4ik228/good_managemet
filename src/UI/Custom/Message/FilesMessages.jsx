import React, { useState } from "react";
import classes from "./FilesMessages.module.css";
import { baseUrl } from "@helpers/constants";
import { FullScreenImageModal } from "../FullScreanImageModal/FullScreanImageModal";

export default function FilesMessages({ attachmentToMessage }) {
  const [openFullImageModal, setOpenFullImageModal] = useState(false);

  const images = attachmentToMessage?.filter((item) =>
    item?.attachment?.attachmentMimetype?.startsWith("image/")
  );
  const files = attachmentToMessage?.filter(
    (item) => !item?.attachment?.attachmentMimetype?.startsWith("image/")
  );

  // Определяем класс сетки в зависимости от количества изображений (по стилю Telegram)
  const getGridClass = (count) => {
    if (count === 1) return classes.grid1;
    if (count === 2) return classes.grid2;
    if (count === 3) return classes.grid3;
    if (count === 4) return classes.grid4;
    if (count === 5) return classes.grid5;
    if (count === 6) return classes.grid6;
    if (count === 7) return classes.grid7;
    if (count === 8) return classes.grid8;
    if (count === 9) return classes.grid9;
    if (count >= 10) return classes.grid10;
    return "";
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.imageGrid} ${getGridClass(images.length)}`}>
        {images?.map((image, idx) => (
          <div key={idx} className={classes.imageWrapper}>
            <img
              key={idx}
              src={`${baseUrl}${image?.attachment?.attachmentPath}`}
              alt={image?.attachment?.attachmentName}
              className={classes.image}
              onClick={() => setOpenFullImageModal(true)}
            />

            {openFullImageModal ? (
              <FullScreenImageModal
                key={idx}
                imageUrl={`${baseUrl}${image?.attachment?.attachmentPath}`}
                onClose={() => setOpenFullImageModal(false)}
              ></FullScreenImageModal>
            ) : null}
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div className={classes.fileList}>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <a
                  href={`${baseUrl}${file?.attachment?.attachmentPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file?.attachment?.attachmentName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
