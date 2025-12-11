import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import EditContainer from '@Custom/EditContainer/EditContainer'
import { useStrategyHook, useObjectiveHook } from "@hooks";

import { ExclamationCircleFilled } from "@ant-design/icons";
import {
    message,
    Modal,
    notification,
} from "antd";
import TextArea from 'antd/es/input/TextArea';
import classes from "./EditStrategy.module.css"
import { useGetSingleStrategy } from '../../../hooks/Strategy/useGetSingleStrategy';
import { useUpdateSingleStrategy } from '../../../hooks/Strategy/useUpdateSingleStrategy';
import { useGetSingleObjective } from '../../../hooks/Objective/useGetSingleObjective';
import { useUpdateSingleObjective } from '../../../hooks/Objective/useUpdateSingleObjective';
import { isEqual } from "lodash";
import ViewProject from './ViewProject';

export function EditStrategy() {

    const { strategyId } = useParams();

    const channel = new BroadcastChannel("strategy_channel");

    const [editorState, setEditorState] = useState("");

    const [contentEditors, setContentEditors] = useState([]);
    const [situationEditors, setSituationEditors] = useState([]);
    const [rootCauseEditors, setRootCauseEditors] = useState([]);

    const [editMode, setEditMode] = useState(true);
    const [isViewProject, setIsViewProject] = useState(false);


    const { currentObjective } = useGetSingleObjective(strategyId);
    const { updateObjective } = useUpdateSingleObjective();


    const { currentStrategy } = useGetSingleStrategy(strategyId)
    const { updateStrategy } = useUpdateSingleStrategy();

    const handleEditorChange = (index, newState, type) => {
        switch (type) {
            case "content":
                setContentEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated[index] = newState;
                    return updated;
                });
                break;
            case "situation":
                setSituationEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated[index] = newState;
                    return updated;
                });
                break;
            case "rootCause":
                setRootCauseEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated[index] = newState;
                    return updated;
                });
                break;
            default:
                break;
        }
    };

    const handleSave = async () => {
        const Data = {};
        if (editorState !== currentStrategy.content) {
            Data.content = editorState;
        }

        try {
            await updateStrategy({
                _id: strategyId,
                ...Data,
            })
                .unwrap()

            await updateObjective({
                _id: currentObjective.id,
                situation: situationEditors,
                content: contentEditors,
                rootCause: rootCauseEditors,
            })
                .unwrap()

            channel.postMessage("updated");
            message.success("Данные успешно обновлены!");
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleReset = () => {
        if (currentStrategy.content) {
            setEditorState(currentStrategy.content);
        }

        if (Array.isArray(currentObjective.content)) {
            setContentEditors(currentObjective.content);
        }

        if (Array.isArray(currentObjective.situation)) {
            setSituationEditors(currentObjective.situation);
        }

        if (Array.isArray(currentObjective.rootCause)) {
            setRootCauseEditors(currentObjective.rootCause);
        }
    };

    const exitClick = () => {
        // Формируем объект текущих данных
        const currentValues = {
            strategyContent: editorState,
            contentEditors,
            situationEditors,
            rootCauseEditors,
        };

        // Формируем объект исходных данных
        const initialValues = {
            strategyContent: currentStrategy.content,
            contentEditors: currentObjective.content || [],
            situationEditors: currentObjective.situation || [],
            rootCauseEditors: currentObjective.rootCause || [],
        };

        // Проверяем, есть ли изменения
        const hasChanges = !isEqual(currentValues, initialValues);

        if (hasChanges) {
            Modal.confirm({
                title: "Есть несохранённые изменения",
                icon: <ExclamationCircleFilled />,
                content: "Вы хотите сохранить изменения перед выходом?",
                okText: "Сохранить",
                cancelText: "Не сохранять",
                onOk() {
                    handleSave().then(() => window.close());
                },
                onCancel() {
                    window.close();
                },
            });
        } else {
            window.close();
        }
    };

    useEffect(() => {
        if (currentStrategy.content) {
            setEditorState(currentStrategy.content);
        }

        if (currentStrategy.state === "Завершено") {
            setEditMode(false);
        }
    }, [currentStrategy.id]);

    useEffect(() => {
        if (Array.isArray(currentObjective.content)) {
            setContentEditors(currentObjective.content);
        }

        if (Array.isArray(currentObjective.situation)) {
            setSituationEditors(currentObjective.situation);
        }

        if (Array.isArray(currentObjective.rootCause)) {
            setRootCauseEditors(currentObjective.rootCause);
        }
    }, [currentObjective]);

    return (
        <EditContainer
            header={`Стратегия №${currentStrategy?.strategyNumber}`}
            saveClick={handleSave}
            canselClick={handleReset}
            exitClick={exitClick}
            // aditionalbtns={[{
            //     name: "Проекты и прграммы",
            //     colorBtn: "#333333",
            //     backgroundColor: "#CFDEE5",
            //     onClick: () => setIsViewProject(!isViewProject),
            //     isBackgroundColor:isViewProject,                
            // }]}
        >

            <div className={classes.wrapper}>

                {
                    isViewProject 
                    ? (
                        <>
                            <ViewProject />

                            <div className={classes.main}>
                                <fieldset className={classes.frame}>
                                    <legend className={classes.title}>Стратегия</legend>
                                    <TextArea
                                        style={{
                                            resize: "none",
                                            border: "none",
                                        }}
                                        key={currentStrategy.id}
                                        value={editorState}
                                        onChange={(e) => setEditorState(e.target.value)}
                                        readOnly={!editMode}
                                        autoSize={true}
                                    ></TextArea>
                                </fieldset>
                            </div>
                        </>
                    )
                    : (
                            <div className={classes.main}>
                                <fieldset className={classes.frame}>
                                    <legend className={classes.title}>Ситуация</legend>
                                    {situationEditors.map((item, index) => (
                                        <TextArea
                                            style={{
                                                resize: "none",
                                                border: "none",
                                            }}
                                            value={item}
                                            onChange={(e) =>
                                                handleEditorChange(index, e.target.value, "situation")
                                            }
                                            readOnly={!editMode}
                                            autoSize={true}
                                        ></TextArea>
                                    ))}
                                </fieldset>


                                <fieldset className={classes.frame}>
                                    <legend className={classes.title}>Причина</legend>
                                    {rootCauseEditors.map((item, index) => (
                                        <TextArea
                                            style={{
                                                resize: "none",
                                                border: "none",
                                            }}
                                            value={item}
                                            onChange={(e) =>
                                                handleEditorChange(index, e.target.value, "rootCause")
                                            }
                                            readOnly={!editMode}
                                            autoSize={true}
                                        ></TextArea>
                                    ))}
                                </fieldset>


                                <fieldset className={classes.frame} style={{
                                    padding: "10px",

                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",

                                    gap: "25px",
                                }}>
                                    <legend className={classes.title}>Краткосрочная цель</legend>

                                    <fieldset className={classes.childFrame}>
                                        <legend className={classes.title} style={{
                                            textTransform: "lowercase"
                                        }}>из ситуации</legend>

                                        <TextArea
                                            style={{
                                                resize: "none",
                                                border: "none",
                                            }}
                                            value={contentEditors[0]}
                                            onChange={(e) =>
                                                handleEditorChange(0, e.target.value, "content")
                                            }
                                            readOnly={!editMode}
                                            autoSize={true}
                                        ></TextArea>
                                    </fieldset>

                                    <fieldset className={classes.childFrame} >
                                        <legend className={classes.title} style={{
                                            textTransform: "lowercase"
                                        }}>из цели</legend>
                                        <TextArea
                                            style={{
                                                resize: "none",
                                                border: "none",
                                            }}
                                            value={contentEditors[1]}
                                            onChange={(e) =>
                                                handleEditorChange(1, e.target.value, "content")
                                            }
                                            readOnly={!editMode}
                                            autoSize={true}
                                        ></TextArea>
                                    </fieldset>

                                </fieldset>

                                <fieldset className={classes.frame}>
                                    <legend className={classes.title}>Стратегия</legend>
                                    <TextArea
                                        style={{
                                            resize: "none",
                                            border: "none",
                                        }}
                                        key={currentStrategy.id}
                                        value={editorState}
                                        onChange={(e) => setEditorState(e.target.value)}
                                        readOnly={!editMode}
                                        autoSize={true}
                                    ></TextArea>
                                </fieldset>
                            </div>
                    )
                }
            </div>


        </EditContainer>
    )
}
