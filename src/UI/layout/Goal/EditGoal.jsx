import React, { useEffect, useState } from 'react'
import EditContainer from '../../Custom/EditContainer/EditContainer'
import classes from './EditGoal.module.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextArea from "@Custom/TextArea/TextArea.jsx";
import { useGoalHook, } from "@hooks";
import { Button, Modal, notification, message } from 'antd';
import { compareStringArray } from "../../../helpers/helpers";
import { ExclamationCircleFilled, HolderOutlined, DeleteOutlined } from '@ant-design/icons';

export default function EditGoal() {
    const channel = new BroadcastChannel("goal_channel");

    const [editorState, setEditorState] = useState([]);
    const [pressedIndex, setPressedIndex] = useState(null);


    const {
        reduxSelectedOrganizationId,

        currentGoal,

        updateGoal,

        postGoal,
    } = useGoalHook();


    const saveGoal = async () => {
        await postGoal({
            content: [""],
            organizationId: reduxSelectedOrganizationId,
        })
            .unwrap()
            .then()
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    };

    const saveUpdateGoal = async () => {
        await updateGoal({
            _id: currentGoal.id,
            content: editorState,
        })
            .unwrap()
            .then(() => {
                message.success("Данные успешно обновлены!");
                channel.postMessage("updated");
            })
            .catch((error) => {
                message.error("Ошибка при сохранении");
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        // Создаем новый массив состояний
        const updatedState = Array.from(editorState);

        // Перемещаем редактор
        const [movedItem] = updatedState.splice(source.index, 1);
        updatedState.splice(destination.index, 0, movedItem);

        setEditorState(updatedState);
    };

    const addEditor = () => {
        if (Object.keys(currentGoal).length > 0) {
            setEditorState((prevEditors) => [...prevEditors, [""]]);
        } else {
            saveGoal();
        }
    };

    const deleteEditor = (index) => {
        setEditorState((prevEditors) => {
            const updated = [...prevEditors];
            updated.splice(index, 1);
            return updated;
        });
    };

    const canselClick = () => {
        setEditorState(currentGoal.content);
    }

    const exitClick = () => {
        if (compareStringArray(currentGoal.content, editorState)) {
            // Показываем модальное окно подтверждения
            Modal.confirm({
                title: 'Есть несохранённые изменения',
                icon: <ExclamationCircleFilled />,
                content: 'Вы хотите сохранить изменения перед выходом из режима редактирования?',
                okText: 'Сохранить',
                cancelText: 'Не сохранять',
                onOk() {
                    // Здесь вызываем функцию сохранения
                    saveUpdateGoal().then(() => {
                        window.close()
                    });
                },
                onCancel() {
                    // Просто выходим из режима редактирования без сохранения
                    window.close()
                    notification.info({
                        message: 'Изменения не сохранены',
                        description: 'Редактирование отменено, изменения не были сохранены.',
                        placement: 'topRight',
                    });
                },
            });
        } else {
            window.close()
        }
    };

    useEffect(() => {
        if (currentGoal.id) {
            setEditorState(currentGoal.content);
        }
    }, [currentGoal]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Enter" && event.ctrlKey) {
                addEditor();
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    return (
        <>
            <EditContainer
                saveClick={saveUpdateGoal}
                canselClick={canselClick}
                exitClick={exitClick}
            >
                <div className={classes.main}>
                    <>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="editorList">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={classes.droppableContainer}
                                    >
                                        {editorState?.map((item, index) => (
                                            <Draggable
                                                key={index}
                                                draggableId={`item-${index}`}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={classes.editorContainer}
                                                    >
                                                        <div
                                                            className={classes.dragHandle}
                                                            onMouseDown={() => setPressedIndex(index)}
                                                            onMouseUp={() => setPressedIndex(null)}
                                                            onMouseLeave={() => setPressedIndex(null)}
                                                        >

                                                            <HolderOutlined {...provided.dragHandleProps} style={{ color: "#999999" }} className={classes.drag} />
                                                        </div>

                                                        <div
                                                            style={{
                                                                padding: "20px",
                                                                height: pressedIndex === index ? "100px" : "auto",
                                                                transition: "height 3.5s ease",
                                                            }}
                                                        >
                                                            <TextArea
                                                                key={index}
                                                                value={item}
                                                                onChange={(newState) => {
                                                                    const updatedState = [...editorState];
                                                                    updatedState[index] = newState;
                                                                    setEditorState(updatedState);
                                                                }}
                                                            />
                                                        </div>

                                                        <Button type="link" onClick={() => deleteEditor(index)} className={classes.deleteIcon}> <DeleteOutlined style={{ color: "#999999" }} /></Button>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <button
                            className={classes.add}
                            onClick={() => addEditor()}
                        >
                            <svg
                                width="19.998047"
                                height="20.000000"
                                viewBox="0 0 19.998 20"
                                fill="none"
                            >
                                <path
                                    id="Vector"
                                    d="M10 20C4.47 19.99 0 15.52 0 10L0 9.8C0.1 4.3 4.63 -0.08 10.13 0C15.62 0.07 20.03 4.56 19.99 10.06C19.96 15.56 15.49 19.99 10 20ZM5 9L5 11L9 11L9 15L11 15L11 11L15 11L15 9L11 9L11 5L9 5L9 9L5 9Z"
                                    fill="#B4B4B4"
                                    fillOpacity="1.000000"
                                    fillRule="nonzero"
                                />
                            </svg>

                            <div>
                                <span className={classes.nameButton}>
                                    Добавить еще одну часть цели (Ctrl+Enter)
                                </span>
                            </div>
                        </button>
                    </>

                </div>
            </EditContainer>
        </>
    )
}
