import React, { useRef, useEffect } from "react";
import "@mdxeditor/editor/style.css";
import {
    MDXEditor,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    InsertImage,
    InsertTable,
    listsPlugin,
    tablePlugin,
    imagePlugin,
    CreateLink,
    linkDialogPlugin,
    linkPlugin,
    Separator,
} from "@mdxeditor/editor";
import i18n from "./i18n";
import { baseUrl } from "@helpers/constants";
import classes from "./Mdxeditor.module.css";
import { usePostImageMutation } from "@services";

export default function Mdxeditor({ editorState, setEditorState, userId, isArchive}) {
    const editorRef = useRef(null); // Ссылка на редактор

    // Функция для обновления содержимого редактора и состояния
    const updateEditorContent = (newContent) => {
        if (editorRef.current && !isArchive) {
            console.log('updateEditorContent')
            editorRef.current.setMarkdown(newContent); // Обновляем содержимое через setMarkdown
            setEditorState(newContent); // Обновляем состояние редактора
        }
    };
  

    const [postImage] = usePostImageMutation();

    // Функция для обработки загрузки изображений
    const imageUploadHandler = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            // Вызов postImage для отправки файла на сервер
            const response = await postImage({
                userId,
                formData,
            }).unwrap();

            // Проверка формата ответа
            const filePath = (response.filePath || response.data?.filePath)?.replace(/\\/g, "/");

            if (!filePath) {
                throw new Error("filePath не найден в ответе сервера");
            }

            console.log("Успешно загружено:", filePath);

            return `${baseUrl}${filePath}`;

        } catch (error) {
            console.error("Ошибка загрузки изображения:", error);
            return Promise.reject(error);
        }
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.editorContainer}>
                <MDXEditor
                    ref={editorRef}
                    markdown={editorState}
                    translation={(key, defaultValue, interpolations) =>
                        i18n.t(key, { defaultValue, ...interpolations })
                    }
                    onChange={updateEditorContent}
                    readOnly={isArchive}
                    contentEditableClassName={classes['markdown-input-comment__editable']}
                    plugins={[
                        linkPlugin(),
                        linkDialogPlugin(),
                        imagePlugin({imageUploadHandler}),
                        tablePlugin(),
                        listsPlugin(),
                        toolbarPlugin({
                            toolbarClassName: classes["toolbar-custom"],
                            toolbarContents: () => (
                                <>
                                    <div style={{ marginRight: "20px" }}>
                                        <UndoRedo />
                                    </div>
                                    <div style={{ marginRight: "20px" }}>
                                        <BoldItalicUnderlineToggles />
                                    </div>
                                    <div style={{ marginRight: "20px" }}>
                                        <ListsToggle />
                                    </div>
                                    <InsertImage />
                                    <Separator />
                                    <InsertTable />
                                    <Separator />
                                    <CreateLink />
                                </>
                            ),
                        }),
                    ]}
                />
            </div>
        </div>
    );
}