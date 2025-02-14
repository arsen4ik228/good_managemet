import React, { useEffect, useState } from 'react';
import classes from './Strategy.module.css';
import { useParams } from "react-router-dom";
import Header from "@Custom/CustomHeader/Header";
import HandlerMutation from "@Custom/mobileHandler/HandlerMutation";
import ModalWindow from '@Custom/ConfirmStrategyToComplited/ModalWindow';
import CustomtextArea from '@Custom/CustomTextarea/CustomtextArea'
import { ButtonContainer } from '@Custom/CustomButtomContainer/ButtonContainer'
import { useStrategyHook } from '@hooks';
import HandlerQeury from '@Custom/HandlerQeury';
import { notEmpty } from '@helpers/helpers';

const MobileStartegy = () => {

    const { strategyId } = useParams()

    const [valueDate, setValueDate] = useState('');
    const [editorState, setEditorState] = useState();
    const [state, setState] = useState('');

    const [openModal, setOpenModal] = useState(false)

    const {
        currentStrategy,
        isLoadingStrategyId,
        isErrorStrategyId,

        activeStrategyId,

        updateStrategy,
        isLoadingUpdateStrategyMutation,
        isSuccessUpdateStrategyMutation,
        isErrorUpdateStrategyMutation,
        errorUpdateStrategyMutation,
        localIsResponseUpdateStrategyMutation

    } = useStrategyHook(strategyId)


    const saveUpdateStrategy = async () => {

        const Data = {}

        if (currentStrategy.state !== state)
            Data.state = state
        if (currentStrategy.content !== editorState)
            Data.content = editorState
        if (notEmpty(Data)) {
            await updateStrategy({
                _id: strategyId,
                ...Data,
            })
                .unwrap()
                .then(() => {
                    // setTimeout(() => navigate(-1), 800);
                    setOpenModal(false)
                })
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
                });
        };
    }


    const save = () => {
        if (
            state === "Активный"
            && currentStrategy.state === "Черновик"
            && activeStrategyId
        )
            setOpenModal(true)
        else
            saveUpdateStrategy()
    };

    const btnYes = async () => {
        await updateStrategy({
            _id: activeStrategyId,
            state: "Завершено",
        })
            .unwrap()
            .then(() => {
                saveUpdateStrategy();
            })
            .catch((error) => {
                // При ошибке также сбрасываем флаги
                // setManualErrorReset(false);
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    const btnNo = async () => {
        saveUpdateStrategy()
    };

    useEffect(() => {
        if (notEmpty(currentStrategy)) {
            setEditorState(currentStrategy.content);
            setState(currentStrategy.state !== state ? currentStrategy.state : state)
            setValueDate(currentStrategy.dataActive !== valueDate ? currentStrategy.dataActive : valueDate)
        }
    }, [currentStrategy]);


    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Редактировать стратегию'}>Личный Помощник</Header>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <span>
                            Cтратегия №{currentStrategy.strategyNumber}
                        </span>
                        <select
                            name={'mySelect'}
                            disabled={currentStrategy.state === 'Завершено'}
                            value={state} onChange={(e) => setState(e.target.value)}
                        >
                            {currentStrategy.state === 'Черновик' && (
                                <option value={'Черновик'}>Черновик</option>
                            )}
                            {currentStrategy.state !== 'Завершено' && (
                                <option value={'Активный'}>Активный</option>
                            )}
                            {currentStrategy.state !== 'Черновик' && (
                                <option value={'Завершено'}>Завершено</option>
                            )}
                        </select>
                        {valueDate && (<input type="date" name="calendar" value={valueDate}
                            onChange={(e) => setValueDate(e.target.value)} />)}

                    </div>
                </div>

                <div className={classes.body}>
                    <div className={classes.textareaContainer}>
                        <CustomtextArea
                            content={editorState}
                            setContent={setEditorState}
                            disabled={currentStrategy.state === 'Завершено'}
                        ></CustomtextArea>
                        {/* <MyEditor
                            editorState={editorState}
                            setEditorState={currentStrategy.state === 'Завершено' ? '' : setEditorState}
                        /> */}
                    </div>
                </div>


                {currentStrategy.state !== 'Завершено' && (
                    <ButtonContainer
                        clickFunction={save}
                    >
                        сохранить
                    </ButtonContainer>
                )}
            </div>

            {openModal && (
                <ModalWindow
                    text={
                        "У Вас уже есть Активная стратегия, при нажатии кнопки Да, Она будет завершена."
                    }
                    close={setOpenModal}
                    btnYes={btnYes}
                    btnNo={btnNo}
                ></ModalWindow>
            )}

            <HandlerQeury
                Loading={isLoadingStrategyId}
                Error={isErrorStrategyId}
            />

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

        </>
    );
};

export default MobileStartegy;