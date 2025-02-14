import React, { useEffect, useState } from "react";
import classes from "./Goal.module.css";
import Header from "@Custom/CustomHeader/Header";
import deleteImage from "@Custom/icon/delete.svg";
import HandlerQeury from "@Custom/HandlerQeury";
import HandlerMutation from "@Custom/mobileHandler/HandlerMutation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CustomtextArea from "@Custom/CustomTextarea/CustomtextArea";
import { useGoalHook } from "@hooks";
import dragIcon from "@Custom/icon/drag _ and _ drop.svg";
import { ButtonContainer } from "@Custom/CustomButtomContainer/ButtonContainer";

function MobileGoal(props) {
  const [editorState, setEditorState] = useState([]);
  const [index, setIndex] = useState();

  const {
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

  const setContent = (newState) => {
    setEditorState(() => {
      const updatedState = [...editorState];
      updatedState[index] = newState;
      return updatedState;
    });
  };

  const addEditor = () => {
    if (Object.keys(currentGoal).length > 0) {
      setEditorState((prevEditors) => [...prevEditors, ""]);
    } else saveGoal();
  };

  const deleteEditor = (index) => {
    setEditorState((prevEditors) => {
      const updated = [...prevEditors];
      updated.splice(index, 1); // Remove the editor at the specified index
      return updated;
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Создаем новый массив состояний
    const updatedState = editorState.map((state) => {
      return state;
      // Создаем новый экземпляр редактора для каждого состояния
      // return EditorState.createWithContent(state.getCurrentContent());
    });

    // Перемещаем редактор
    const [movedItem] = updatedState.splice(source.index, 1);
    updatedState.splice(destination.index, 0, movedItem);

    setEditorState(updatedState);
  };

  const saveGoal = async () => {
    await postGoal({
      content: [""],
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
      .then()
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  useEffect(() => {
    if (!Array.isArray(currentGoal.content)) return;

    setEditorState([...(currentGoal.content || [])]);
  }, [currentGoal]);

  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header title={"Цели"}>Личный помощник</Header>
        </>

        <div className={classes.body}>
          <>
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
                            key={index}
                            className={classes.textareaContainer}
                            onClick={() => setIndex(index)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <CustomtextArea
                              content={item}
                              setContent={setContent}
                            ></CustomtextArea>
                            <img
                              src={deleteImage}
                              alt="deleteImage"
                              className={classes.deleteIcon}
                              onClick={() => deleteEditor(index)}
                            />
                            <img
                              src={dragIcon}
                              alt="dragImage"
                              className={classes.dragIcon}
                              {...provided.dragHandleProps}
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

            <button className={classes.add} onClick={() => addEditor()}>
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
                  Добавить еще одну часть цели
                </span>
              </div>
            </button>
          </>
        </div>

        <ButtonContainer clickFunction={saveUpdateGoal}>
          сохранить
        </ButtonContainer>
      </div>

      <HandlerQeury
        Loading={isLoadingGetGoal}
        Fetching={isFetchingGetGoal}
        Error={isErrorGetGoal}
      ></HandlerQeury>
      <HandlerMutation
        Loading={isLoadingUpdateGoalMutation}
        Error={isErrorUpdateGoalMutation && localIsResponseUpdateGoalMutation}
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
        Success={isSuccessPostGoalMutation && localIsResponsePostGoalMutation}
        textSuccess={"Цель создана"}
        textError={
          ErrorPostGoalMutation?.data?.errors?.[0]?.errors?.[0]
            ? ErrorPostGoalMutation.data.errors[0].errors[0]
            : ErrorPostGoalMutation?.data?.message
        }
      ></HandlerMutation>
    </>
  );
}

export default MobileGoal;
