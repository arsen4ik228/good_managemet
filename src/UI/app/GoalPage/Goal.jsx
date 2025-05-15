import React, { useState, useEffect, useRef } from "react";
import classes from "./Goal.module.css";
import drag from "@image/drag.svg";
import deleteImage from "@image/delete.svg";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextArea from "@Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import { useGoalHook } from "@hooks";

import { ConfigProvider, Tour, Button } from "antd";
import ruRU from "antd/locale/ru_RU";

export default function Goal() {
  const [editorState, setEditorState] = useState([]);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const refUpdate = useRef(null);

  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
    {
      title: "Изменить порядок",
      description: "Нажмите и перетащите часть цели",
      target: () => (editorState.length > 0 ? ref1.current : null),
      disabled: !editorState.length, 
    },
    {
      title: "Удалить",
      description: "Удалите чась цели",
      target: () => (editorState.length > 0 ? ref2.current : null),
      disabled: !editorState.length, 
    },
    {
      title: "Добавить",
      description: "Добавьте новую часть цели",
      target: () => ref3.current,
    },
  ].filter(step => !step.disabled);;

  const {
    reduxSelectedOrganizationId,

    currentGoal,
    isErrorGetGoal,
    isLoadingGetGoal,
    isFetchingGetGoal,

    updateGoal,
    isLoadingUpdateGoalMutation,
    isSuccessUpdateGoalMutation,
    isErrorUpdateGoalMutation,
    ErrorUpdateGoalMutation,
    localIsResponseUpdateGoalMutation,

    postGoal,
    isLoadingPostGoalMutation,
    isSuccessPostGoalMutation,
    isErrorPostGoalMutation,
    ErrorPostGoalMutation,
    localIsResponsePostGoalMutation,
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
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
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
    <div className={classes.dialog}>

      <Headers name={"цели"} funcActiveHint = {() => setOpen(true)}>
        <BottomHeaders update={saveUpdateGoal} refUpdate={refUpdate}></BottomHeaders>
      </Headers>

      <div className={classes.main}>

        <ConfigProvider locale={ruRU}>
          <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        </ConfigProvider>


        {isErrorGetGoal ? (
          <>
            <HandlerQeury Error={isErrorGetGoal}></HandlerQeury>
          </>
        ) : (
          <>
            <HandlerQeury
              Loading={isLoadingGetGoal}
              Fetching={isFetchingGetGoal}
            ></HandlerQeury>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="editorList">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={classes.droppableContainer}
                  >
                    {editorState.map((item, index) => (
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
                              {...provided.dragHandleProps}
                              className={classes.dragHandle}
                            >
                              <img ref={ref1} src={drag} alt="drag" />
                            </div>

                            <TextArea
                              key={index}
                              value={item}
                              onChange={(newState) => {
                                const updatedState = [...editorState];
                                updatedState[index] = newState;
                                setEditorState(updatedState);
                              }}
                            ></TextArea>

                            <img
                              ref={ref2}
                              src={deleteImage}
                              alt="deleteImage"
                              className={classes.deleteIcon}
                              onClick={() => deleteEditor(index)}
                            />
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
              ref={ref3}
              className={classes.add}
              onClick={() => addEditor()}
            >
              <svg
                width="19.998047"
                height="20.000000"
                viewBox="0 0 19.998 20"
                fill="none"
              >
                <defs />
                <path
                  id="Vector"
                  d="M10 20C4.47 19.99 0 15.52 0 10L0 9.8C0.1 4.3 4.63 -0.08 10.13 0C15.62 0.07 20.03 4.56 19.99 10.06C19.96 15.56 15.49 19.99 10 20ZM5 9L5 11L9 11L9 15L11 15L11 11L15 11L15 9L11 9L11 5L9 5L9 9L5 9Z"
                  fill="#B4B4B4"
                  fill-opacity="1.000000"
                  fill-rule="nonzero"
                />
              </svg>

              <div>
                <span className={classes.nameButton}>
                  Добавить еще одну часть цели (Ctrl+Enter)
                </span>
              </div>
            </button>

            <HandlerMutation
              Loading={isLoadingUpdateGoalMutation}
              Error={
                isErrorUpdateGoalMutation && localIsResponseUpdateGoalMutation
              }
              Success={
                isSuccessUpdateGoalMutation && localIsResponseUpdateGoalMutation
              }
              textSuccess={"Цель обновлена"}
              textError={
                ErrorUpdateGoalMutation?.data?.errors?.[0]?.errors?.[0]
                  ? ErrorUpdateGoalMutation.data.errors[0].errors[0]
                  : ErrorUpdateGoalMutation?.data?.message
              }
            ></HandlerMutation>

            <HandlerMutation
              Loading={isLoadingPostGoalMutation}
              Error={isErrorPostGoalMutation && localIsResponsePostGoalMutation}
              Success={
                isSuccessPostGoalMutation && localIsResponsePostGoalMutation
              }
              textSuccess={"Цель создана"}
              textError={
                ErrorPostGoalMutation?.data?.errors?.[0]?.errors?.[0]
                  ? ErrorPostGoalMutation.data.errors[0].errors[0]
                  : ErrorPostGoalMutation?.data?.message
              }
            ></HandlerMutation>
          </>
        )}
      </div>
    </div>
  );
}
