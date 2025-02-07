import React, { useState, useEffect } from "react";
import classes from "./Strategy.module.css";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import WaveLetters from "@Custom/WaveLetters.jsx";
import ModalWindow from "@Custom/ModalWindow.jsx";
import TextArea from "@Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import SelectBorder from "@Custom/SelectBorder/SelectBorder";
import Select from "@Custom/Select/Select";
import {useStrategyHook} from "@hooks";

export default function Strategy() {
  const [number, setNumber] = useState("");
  const [state, setState] = useState("");
  const [editorState, setEditorState] = useState("");

  const [postId, setPostId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalDraft, setOpenModalDraft] = useState(false);

  const {
    reduxSelectedOrganizationId,

    // Получить все стратегии
    activeAndDraftStrategies,
    archiveStrategies,
    activeStrategyId,
    hasDraftStrategies,
    isLoadingStrategies,
    isErrorStrategies,

    // Создать стратегию
    postStrategy,
    isLoadingPostStrategyMutation,
    isSuccessPostStrategyMutation,
    isErrorPostStrategyMutation,
    errorPostStrategyMutation,
    localIsResponsePostStrategyMutation,

    // Получить стратегию по id
    currentStrategy,
    currentStrategyState,
    isLoadingStrategyId,
    isFetchingStrategyId,
    isErrorStrategyId,
    

    // Обновить стратегию
    updateStrategy,
    isLoadingUpdateStrategyMutation,
    isSuccessUpdateStrategyMutation,
    isErrorUpdateStrategyMutation,
    errorUpdateStrategyMutation,
    localIsResponseUpdateStrategyMutation
  } = useStrategyHook(number);

  const stateMapping = {
    Черновик: ["Активный", "Черновик"],
    Активный: ["Активный", "Завершено"],
    Завершено: ["Завершено"],
  };

  const filteredArrayState = (stateMapping[currentStrategy.state] || []).map(
    (id) => ({
      id,
      value: id,
    })
  );

  const handleNumberOnChange = (e) => {
    setNumber(e);
  };

  const newStrateg = () => {
    if (hasDraftStrategies === true) {
      setOpenModalDraft(true);
    } else {
      savePostStarteg();
    }
  };

  const savePostStarteg = async () => {
    await postStrategy({
      content: " ",
      organizationId: reduxSelectedOrganizationId,
    })
      .unwrap()
      .then((result) => {
        setPostId(result.id);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const save = () => {
    console.log("activeStrategyId");
    console.log(activeStrategyId);
    if (
      state === "Активный" &&
      currentStrategy.state === "Черновик" &&
      activeStrategyId
    ) {
      setOpenModal(true);
    } else {
      saveUpdateStrateg();
    }
  };

  const saveUpdateStrateg = async () => {
    const Data = [];
    if (state !== "" && state !== currentStrategy.state) {
      Data.state = state;
    }
    console.log(editorState);
    if (editorState !== currentStrategy.content) {
      Data.content = editorState;
    }
    await updateStrategy({
      _id: number,
      ...Data,
    })
      .unwrap()
      .then(() => {
        setOpenModal(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const btnYes = async () => {
    await updateStrategy({
      _id: activeStrategyId,
      state: "Завершено",
    })
      .unwrap()
      .then(() => {
        saveUpdateStrateg();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const btnNo = async () => {
    const Data = [];
    if (editorState !== currentStrategy.content) {
      Data.content = editorState;
    }
    if (Data.content) {
      await updateStrategy({
        _id: number,
        ...Data,
      })
        .unwrap()
        .then(() => {
          setState("Черновик");
          setOpenModal(false);
        })
        .catch((error) => {
          console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
        });
    } else {
      setOpenModal(false);
      setState("Черновик");
    }
  };

  useEffect(() => {
    if (postId !== null) {
      setNumber(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (currentStrategy.content) {
      setEditorState(currentStrategy.content);
    }

    if (currentStrategy.state) {
      setState(currentStrategy.state);
    }
  }, [currentStrategy.id]);

  return (
    <div className={classes.dialog}>
      <Headers name={"стратегия"}>
        <BottomHeaders create={newStrateg} update={save}>
          <SelectBorder
            value={number}
            onChange={handleNumberOnChange}
            array={activeAndDraftStrategies}
            array1={archiveStrategies}
            arrayItem={"strategyNumber"}
            prefix={"Стратегия №"}
            styleSelected={currentStrategyState}
          ></SelectBorder>
          {number && (
            <Select
              name={"Состояние"}
              value={state}
              onChange={setState}
              array={filteredArrayState}
              arrayItem={"value"}
              disabledPole={currentStrategy.state === "Завершено"}
            ></Select>
          )}
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
        {isErrorStrategies ? (
          <>
            <HandlerQeury Error={true}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorStrategyId ? (
              <HandlerQeury Error={isErrorStrategyId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury Loading={isLoadingStrategies}></HandlerQeury>

                {isLoadingStrategyId || isFetchingStrategyId ? (
                  <HandlerQeury
                    Loading={isLoadingStrategyId}
                    Fetching={isFetchingStrategyId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentStrategy.id ? (
                      <>
                        <TextArea
                          key={currentStrategy.id}
                          value={editorState}
                          onChange={setEditorState}
                          readOnly={currentStrategy.state === "Завершено"}
                        ></TextArea>

                        <HandlerMutation
                          Loading={isLoadingUpdateStrategyMutation}
                          Error={isErrorUpdateStrategyMutation && localIsResponseUpdateStrategyMutation}
                          Success= {isSuccessUpdateStrategyMutation && localIsResponseUpdateStrategyMutation}
                          textSuccess={"Стратегия обновлена"}
                          textError={
                            errorUpdateStrategyMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? errorUpdateStrategyMutation.data.errors[0]
                                  .errors[0]
                              : errorUpdateStrategyMutation?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingPostStrategyMutation}
                          Error={isErrorPostStrategyMutation && localIsResponsePostStrategyMutation}
                          Success={ isSuccessPostStrategyMutation && localIsResponsePostStrategyMutation }
                          textSuccess={"Стратегия успешно создана."}
                          textError={
                            errorPostStrategyMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? errorPostStrategyMutation.data.errors[0]
                                  .errors[0]
                              : errorPostStrategyMutation?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите стратегию"}
                        ></WaveLetters>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        {openModal ? (
          <ModalWindow
            text={
              "У Вас уже есть Активная стратегия, при нажатии на Да, Она будет завершена."
            }
            close={setOpenModal}
            btnYes={btnYes}
            btnNo={btnNo}
          ></ModalWindow>
        ) : (
          <></>
        )}

        {openModalDraft ? (
          <ModalWindow
            text={"У Вас уже есть Черновик стратегии"}
            close={setOpenModalDraft}
            exitBtn={true}
          ></ModalWindow>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
