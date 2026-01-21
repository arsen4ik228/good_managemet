import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ExclamationCircleFilled } from "@ant-design/icons";
import { message, Modal } from "antd";

import { useGetSingleStrategy } from "@hooks/Strategy/useGetSingleStrategy";
import { useUpdateSingleStrategy } from "@hooks/Strategy/useUpdateSingleStrategy";
import { useGetSingleObjective } from "@hooks/Objective/useGetSingleObjective";
import { useUpdateSingleObjective } from "@hooks/Objective/useUpdateSingleObjective";
import { isEqual } from "lodash";

export default function useEditStrategy() {
  const { strategyId } = useParams();

  const [editorState, setEditorState] = useState("");

  const [contentEditors, setContentEditors] = useState([]);
  const [situationEditors, setSituationEditors] = useState([]);
  const [rootCauseEditors, setRootCauseEditors] = useState([]);

  const [editMode, setEditMode] = useState(true);

  const { currentObjective } = useGetSingleObjective(strategyId);
  const { updateObjective } = useUpdateSingleObjective();

  const { currentStrategy } = useGetSingleStrategy(strategyId);
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
      }).unwrap();

      await updateObjective({
        _id: currentObjective.id,
        situation: situationEditors,
        content: contentEditors,
        rootCause: rootCauseEditors,
      }).unwrap();

      message.success("Данные успешно обновлены!");
    } catch (err) {
      console.error(err);
    }
  };

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

  return {
    currentStrategy, 
    setEditorState,

    editorState,
    contentEditors,
    situationEditors,
    rootCauseEditors,

    editMode,

    handleEditorChange,
    handleSave,
    handleReset,
    exitClick,
  };
}
