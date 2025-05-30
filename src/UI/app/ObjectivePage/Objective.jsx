import React, { useState, useEffect, useRef} from "react";
import classes from "./Objective.module.css";
import classNames from "classnames";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import WaveLetters from "@Custom/WaveLetters.jsx";
import TextArea from "@Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import SelectBorder from "@Custom/SelectBorder/SelectBorder";
import { useObjectiveHook, useStrategyHook } from "@hooks";

import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";

export default function Objective() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStrategyId, setSelectedStrategyId] = useState("");

  const [contentEditors, setContentEditors] = useState([]);
  const [situationEditors, setSituationEditors] = useState([]);
  const [rootCauseEditors, setRootCauseEditors] = useState([]);

  const [stateStrategy, setStateStrategy] = useState("");

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const refSelectBorder = useRef(null);
  const refUpdate = useRef(null);

  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "КРАТКОСРОЧАЯ ЦЕЛЬ",
      description: "КРАТКОСРОЧАЯ ЦЕЛЬ",
      target: () => ref1.current,
    },
    {
      title: "СИТУАЦИЯ",
      description: "СИТУАЦИЯ",
      target: () => ref2.current,
    },
    {
      title: "ПРИЧИНА",
      description: "ПРИЧИНА",
      target: () => ref3.current,
    },
    {
      title: "Выбрать стратегию",
      description: "Выбрать стратегию для показа краткосрочной цели",
      target: () => refSelectBorder.current,
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
  ];

  const {
    currentObjective,
    isLoadingGetObjectiveId,
    isErrorGetObjectiveId,
    isFetchingGetObjectiveId,

    updateObjective,
    isLoadingUpdateObjectiveMutation,
    isSuccessUpdateObjectiveMutation,
    isErrorUpdateObjectiveMutation,
    errorUpdateObjectiveMutation,
    localIsResponseUpdateObjectiveMutation,
  } = useObjectiveHook(selectedStrategyId);

  const {
    activeAndDraftStrategies,
    archiveStrategies,
    isLoadingStrategies,
    isErrorStrategies,
  } = useStrategyHook();

  const saveUpdateObjective = async () => {
    await updateObjective({
      _id: currentObjective.id,
      situation: situationEditors,
      content: contentEditors,
      rootCause: rootCauseEditors,
    })
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Error:", JSON.stringify(error, null, 2));
      });
  };

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

  const changeStrategyId = (id) => {
    setSelectedStrategyId(id);
  };

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

  useEffect(() => {
    const array = [...archiveStrategies, ...activeAndDraftStrategies];
    const element = array.find((item) => item.id === selectedStrategyId);
    setStateStrategy(element?.state);
  }, [selectedStrategyId]);

  return (
    <div className={classes.dialog}>
      <Headers name={"Краткосрочная цель"} speedGoal={"speedGoal"}  funcActiveHint = {() => setOpen(true)}>
        <div className={classes.selectHeader}>
          {[{name: "КРАТКОСРОЧАЯ ЦЕЛЬ", ref: ref1},{name: "СИТУАЦИЯ", ref: ref2} , {name: "ПРИЧИНА", ref: ref3}].map((obj, index) => (
            <div
             ref={obj.ref}
              key={index}
              className={classNames(
                classes.textSelectHeader,
                activeIndex === index && classes.activeTextSelectHeader
              )}
              onClick={() => setActiveIndex(index)}
            >
              <span
                className={classNames(
                  activeIndex === index
                    ? classes.active
                    : classes.textSelectHeaderSpan
                )}
              >
                {obj.name}
              </span>
            </div>
          ))}
        </div>
        <BottomHeaders update={saveUpdateObjective} refUpdate={refUpdate}> 
          <SelectBorder
            refSelectBorder = {refSelectBorder}
            value={selectedStrategyId}
            onChange={changeStrategyId}
            array={activeAndDraftStrategies}
            array1={archiveStrategies}
            arrayItem={"strategyNumber"}
            prefix={"Стратегия №"}
            styleSelected={stateStrategy}
          ></SelectBorder>
        </BottomHeaders>
      </Headers>

        <ConfigProvider locale={ruRU}>
          <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        </ConfigProvider>

      <div className={classes.main}>
        {isErrorGetObjectiveId || isErrorStrategies ? (
          <HandlerQeury Error={isErrorGetObjectiveId || isErrorStrategies} />
        ) : isLoadingStrategies ||
          isFetchingGetObjectiveId ||
          isLoadingGetObjectiveId ? (
          <HandlerQeury
            Loading={isLoadingStrategies || isLoadingGetObjectiveId}
            Fetching={isFetchingGetObjectiveId}
          />
        ) : (
          <>
            {currentObjective.id ? (
              <>
                {activeIndex === 0 && (
                  <>
                    {contentEditors.map((item, index) => (
                      <TextArea
                        key={index}
                        value={item}
                        onChange={(newState) =>
                          handleEditorChange(index, newState, "content")
                        }
                        readOnly={stateStrategy === "Завершено"}
                      ></TextArea>
                    ))}
                  </>
                )}

                {activeIndex === 1 && (
                  <>
                    {situationEditors.map((item, index) => (
                      <TextArea
                        key={index}
                        value={item}
                        onChange={(newState) =>
                          handleEditorChange(index, newState, "situation")
                        }
                        readOnly={stateStrategy === "Завершено"}
                      ></TextArea>
                    ))}
                  </>
                )}

                {activeIndex === 2 && (
                  <>
                    {rootCauseEditors.map((item, index) => (
                      <TextArea
                        key={index}
                        value={item}
                        onChange={(newState) =>
                          handleEditorChange(index, newState, "rootCause")
                        }
                        readOnly={stateStrategy === "Завершено"}
                      ></TextArea>
                    ))}
                  </>
                )}

                <HandlerMutation
                  Loading={isLoadingUpdateObjectiveMutation}
                  Error={
                    isErrorUpdateObjectiveMutation &&
                    localIsResponseUpdateObjectiveMutation
                  }
                  Success={
                    isSuccessUpdateObjectiveMutation &&
                    localIsResponseUpdateObjectiveMutation
                  }
                  textSuccess={"Краткосрочная цель обновлена"}
                  textError={
                    errorUpdateObjectiveMutation?.data?.errors?.[0]?.errors?.[0]
                      ? errorUpdateObjectiveMutation.data.errors[0].errors[0]
                      : errorUpdateObjectiveMutation?.data?.message
                  }
                />
              </>
            ) : (
              <>
                <WaveLetters letters={"Выберите стратегию"}></WaveLetters>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
