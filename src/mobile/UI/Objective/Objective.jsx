import React, { useEffect, useState } from 'react';
import Header from "../Custom/CustomHeader/Header";
import classes from "./Objective.module.css";
import HandlerQeury from "../Custom/HandlerQeury";
import HandlerMutation from "../Custom/HandlerMutation";
import { useObjectiveHook } from '@hooks'
import { useStrategyHook } from '@hooks';
import { ButtonContainer } from '../Custom/CustomButtomContainer/ButtonContainer';
import CustomtextArea from '../Custom/CustomTextarea/CustomtextArea';


function Objective(props) {
    const [activeIndexofType, setActiveIndexOfType] = useState(0);
    const [selectedStrategyId, setSelectedStrategyId] = useState('');
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);
    const [index, setIndex] = useState()
    const [isArchive,setIsArchive] = useState(false)

    const [contentEditors, setContentEditors] = useState([]);
    const [situationEditors, setSituationEditors] = useState([]);
    const [rootCauseEditors, setRootCauseEditors] = useState([]);

  
    const {
        currentSpeedGoal,
        isLoadingGetSpeedGoalId,
        isErrorGetSpeedGoalId,

        updateSpeedGoal,
        isLoadingUpdateSpeedGoalMutation,
        isSuccessUpdateSpeedGoalMutation,
        isErrorUpdateSpeedGoalMutation,
    } = useObjectiveHook(selectedStrategyId)

    console.log(currentSpeedGoal)

    const {
        activeAndDraftStrategies,
        archiveStrategies,
        isLoadingStrateg,
        isErrorStrateg
    } = useStrategyHook()

    const CONTENT_TYPE = {
        0: { array: contentEditors, setFunction: setContentEditors },
        1: { array: situationEditors, setFunction: setSituationEditors },
        2: { array: rootCauseEditors, setFunction: setRootCauseEditors },
    }

    const saveUpdateSpeedGoal = async () => {

        const Data = {}
        if (currentSpeedGoal.content[0] !== contentEditors[0] || currentSpeedGoal.content[1] !== contentEditors[1])
            Data.content = contentEditors
        if (currentSpeedGoal.situation[0] !== situationEditors[0])
            Data.situation = situationEditors
        if (currentSpeedGoal.rootCause[0] !== rootCauseEditors[0])
            Data.rootCause = rootCauseEditors
        if (Object.keys(Data).length > 0) {
            await updateSpeedGoal({
                _id: currentSpeedGoal.id,
                ...Data
            })
                .unwrap()
                .then(() => {
                    setManualSuccessReset(false);
                    setManualErrorReset(false);
                })
                .catch((error) => {
                    setManualErrorReset(false);
                    console.error("Error:", JSON.stringify(error, null, 2));
                });
        }

    };

    const setContent = (newState) => {
        const { setFunction } = CONTENT_TYPE[activeIndexofType]
        setFunction((prevEditors) => {
            const updated = [...prevEditors];
            updated[index] = newState;
            return updated;
        });
    }

    useEffect(() => {
        if (!activeAndDraftStrategies.length > 0) return
        setSelectedStrategyId(activeAndDraftStrategies[0]?.id)
        setIsArchive(activeAndDraftStrategies[0]?.state === 'Завершена' ? true : false)
    }, [activeAndDraftStrategies])
    console.warn(activeAndDraftStrategies[0])

    useEffect(() => {
        setIsArchive(archiveStrategies.some(item => item.id === selectedStrategyId))
    }, [selectedStrategyId])

    useEffect(() => {

        if (!Object.keys(currentSpeedGoal).length > 0) return

        const initializeEditors = (array, setArray) => {
            if (!Array.isArray(array) || array === null)
                setArray([]);
            else
                setArray([...array])

        };

        initializeEditors(currentSpeedGoal.content, setContentEditors);
        initializeEditors(currentSpeedGoal.situation, setSituationEditors);
        initializeEditors(currentSpeedGoal.rootCause, setRootCauseEditors);

    }, [currentSpeedGoal]);



    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Краткосрочная цель'}>Личный Помощник</Header>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'strategy'} onChange={(e) => setSelectedStrategyId(e.target.value)}>
                            {activeAndDraftStrategies?.map((item, index) => (
                                <>
                                    <option
                                        key={index}
                                        value={item?.id}
                                        style={{ color: item?.state === 'Активный' ? '#005475' : 'none' }}
                                    >
                                        Стратегия №{item?.strategyNumber}
                                    </option>
                                </>
                            ))}
                            {archiveStrategies?.map((item, index) => (
                                <>
                                    <option
                                        key={index}
                                        value={item?.id}
                                        style={{ color: 'grey' }}
                                    >
                                        Стратегия №{item?.strategyNumber}
                                    </option>
                                </>
                            ))}
                        </select>
                    </div>

                    <div className={classes.second}>
                        <select name={'type'} value={activeIndexofType} onChange={(e) => setActiveIndexOfType(e.target.value)}>
                            <option value={0}> Краткосрочная цель</option>
                            <option value={1}> Ситуация</option>
                            <option value={2}> Причина</option>
                        </select>
                    </div>
                </div>


                <div className={classes.body}>

                    <>
                        {selectedStrategyId.length > 0 && (
                            <>
                                {CONTENT_TYPE[activeIndexofType].array?.map((item, index) => (
                                    <div
                                        key={index}
                                        className={classes.textareaContainer}
                                        onClick={() => setIndex(index)}
                                    >
                                        <CustomtextArea
                                            content={item}
                                            setContent={setContent}
                                            disabled={isArchive}
                                        ></CustomtextArea>
                                    </div>
                                ))}


                            </>
                        )}
                    </>
                </div>

                {!isArchive && (
                    <ButtonContainer
                    clickFunction={saveUpdateSpeedGoal}
                    disabled={isArchive}
                >
                    сохранить
                </ButtonContainer>
                )}
            </div>

            <HandlerQeury
                Loading={isLoadingGetSpeedGoalId}
                Error={isErrorGetSpeedGoalId}
            />

            <HandlerQeury
                Loading={isLoadingStrateg}
                Error={isErrorStrateg}
            />

            <HandlerMutation
                Loading={isLoadingUpdateSpeedGoalMutation}
                Error={isErrorUpdateSpeedGoalMutation && !manualErrorReset}
                Success={isSuccessUpdateSpeedGoalMutation && !manualSuccessReset}
                textSuccess={"Краткосрочная цель обновлена"}
            />

        </>
    );
}

export default Objective;