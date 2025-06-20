import React, { useState, useEffect, useRef } from "react";
import classes from "./Strategy.module.css";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import WaveLetters from "@Custom/WaveLetters.jsx";
import ModalWindow from "@Custom/ModalWindow.jsx";
import TextArea from "@Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import SelectBorder from "@Custom/SelectBorder/SelectBorder";
// import Select from "@Custom/Select/Select";
import { useStrategyHook } from "@hooks";

import { ConfigProvider, Tour, Select } from "antd";
import ruRU from "antd/locale/ru_RU";

const { Option } = Select;

export default function Strategy() {
  const [number, setNumber] = useState("");
  const [state, setState] = useState("");
  const [editorState, setEditorState] = useState("");
  console.log(state)
  const [postId, setPostId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDraft, setOpenModalDraft] = useState(false);

  const selectRef = useRef(null);
  const selectBorderRef = useRef(null);
  const refCreate = useRef(null);
  const refUpdate = useRef(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Выбрать стратегию",
      description: "Выбрать стратегию для показа краткосрочной цели",
      target: () => selectBorderRef.current?.select,
    },
    {
      title: "Состояние стратегии",
      description: "Нажмите и поменяйте состояние",
      target: () => (number ? selectRef.current?.select : null),
      disabled: !number,
    },
    {
      title: "Создать",
      description: "Нажмите для создания стратегии",
      target: () => refCreate.current,
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
  ].filter(step => !step.disabled);

  const {
    reduxSelectedOrganizationId,
    activeAndDraftStrategies,
    archiveStrategies,
    activeStrategyId,
    hasDraftStrategies,
    isLoadingStrategies,
    isErrorStrategies,
    postStrategy,
    isLoadingPostStrategyMutation,
    isSuccessPostStrategyMutation,
    isErrorPostStrategyMutation,
    errorPostStrategyMutation,
    localIsResponsePostStrategyMutation,
    currentStrategy,
    currentStrategyState,
    isLoadingStrategyId,
    isFetchingStrategyId,
    isErrorStrategyId,
    updateStrategy,
    isLoadingUpdateStrategyMutation,
    isSuccessUpdateStrategyMutation,
    isErrorUpdateStrategyMutation,
    errorUpdateStrategyMutation,
    localIsResponseUpdateStrategyMutation,
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

  const handleNumberOnChange = (value) => {
    setNumber(value);
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
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const save = () => {
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
    const Data = {};
    if (state !== "" && state !== currentStrategy.state) {
      Data.state = state;
    }
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
        console.error("Ошибка:", JSON.stringify(error, null, 2));
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
    const Data = {};
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
          console.error("Ошибка:", JSON.stringify(error, null, 2));
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
      <Headers name={"стратегия"} funcActiveHint={() => setOpen(true)}>
        <BottomHeaders
          create={newStrateg}
          update={save}
          refCreate={refCreate}
          refUpdate={refUpdate}
        >
          {/* <SelectBorder
            refSelectBorder={refSelectBorder}
            value={number}
            onChange={handleNumberOnChange}
            array={activeAndDraftStrategies}
            array1={archiveStrategies}
            arrayItem={"strategyNumber"}
            prefix={"Стратегия №"}
            styleSelected={currentStrategyState}
          ></SelectBorder> */}

          <Select
            data-tour='refSelectBorder'
            placeholder="Выберите стратегию"
            value={number}
            onChange={(e) => setNumber(e)}
            style={{ width: '230px' }}
          >
            {activeAndDraftStrategies.concat(archiveStrategies).map((item, index) => (
              <Select.Option
                value={item.id}
                style={{ color: item.state === 'Активный' ? '#005475' : item.state === 'Завершено' ? 'grey' : 'none' }}
              >
                Стратегия № {item.strategyNumber}
              </Select.Option>
            ))}
          </Select>

          {number && (
            <Select
              ref={selectRef}
              value={state}
              onChange={(e) => setState(e)}
              options={filteredArrayState}
              arrayItem={"value"}
              disabledPole={currentStrategy.state === "Завершено"}
            ></Select>
          )}
        </BottomHeaders>
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </ConfigProvider>

      <div className={classes.main}>
        {isErrorStrategies ? (
          <HandlerQeury Error={true} />
        ) : isErrorStrategyId ? (
          <HandlerQeury Error={isErrorStrategyId} />
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
                          Error={
                            isErrorUpdateStrategyMutation &&
                            localIsResponseUpdateStrategyMutation
                          }
                          Success={
                            isSuccessUpdateStrategyMutation &&
                            localIsResponseUpdateStrategyMutation
                          }
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
                          Error={
                            isErrorPostStrategyMutation &&
                            localIsResponsePostStrategyMutation
                          }
                          Success={
                            isSuccessPostStrategyMutation &&
                            localIsResponsePostStrategyMutation
                          }
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
        {openModal && (
          <ModalWindow
            text="У Вас уже есть Активная стратегия, при нажатии на Да, Она будет завершена."
            close={setOpenModal}
            btnYes={btnYes}
            btnNo={btnNo}
          />
        )}
        {openModalDraft && (
          <ModalWindow
            text="У Вас уже есть Черновик стратегии"
            close={setOpenModalDraft}
            exitBtn={true}
          />
        )}
      </div>
    </div>
  );
}