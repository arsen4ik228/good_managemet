import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./MyEditor.css";

export default function MyEditor({
  editorState,
  setEditorState,
  userId,
  policyId,
  policyContent,
}) {
//   const [postImage] = usePostImageMutation();

  // Функция для обработки загрузки изображений
//   const uploadImageCallback = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       // Вызов postImage для отправки файла на сервер
//       const response = await postImage({
//         userId,
//         policyId,
//         formData,
//       }).unwrap();
//       console.log("Успешно загружено:", response);
//       return response; // Можно вернуть ответ, если это нужно
//     } catch (error) {
//       console.error("Ошибка загрузки изображения:", error);
//       return Promise.reject(error);
//     }
//   };

  return (
    <div>
      {policyContent ? (
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          toolbarClassName="demo-toolbar"
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
            //   uploadCallback: uploadImageCallback, 
              alt: { present: true, mandatory: false },
              previewImage: true,
            },
          }}
        />
      ) : (
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          toolbarHidden={true}
        />
      )}
    </div>
  );
}