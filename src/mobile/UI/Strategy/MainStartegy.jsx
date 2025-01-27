import React, { useState } from 'react';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './MainStartegy.module.css'
import { useNavigate } from "react-router-dom";
import Header from "../Custom/CustomHeader/Header";
import addIcon from '../Custom/icon/icon _ add _ blue.svg'
import AlertDraftIsExists from '../Custom/AlertDraftIsExists/AlertDraftIsExists';
import { useStartegyHook } from '../../hooks/useStrategyHook';
import HandlerMutation from '../Custom/HandlerMutation';
import HandlerQeury from '../Custom/HandlerQeury';

const MainStrategy = () => {

    const navigate = useNavigate()
    const [modalAlertOpen, setModalAlertOpen] = useState(false)

    const [manualSuccessReset, setManualSuccessReset] = useState(false)
    const [manualErrorReset, setManualErrorReset] = useState(false)

    const {
        activeAndDraftStrategies,
        archiveStrategies,
        isLoadingStrategy,
        isErrorStrategy,


        postStrategy,
        isLoadingPostStrategyMutation,
        isSuccessPostStrategyMutation,
        isErrorPostStrategyMutation,
        errorPostStrategyMutation,
    } = useStartegyHook()


    const saveNewStrategy = async () => {
        await postStrategy()
            .unwrap()
            .then((result) => {
                navigate(result?.id)
                setManualSuccessReset(false);
                setManualErrorReset(false);
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    }

    const createNew = () => {
        const draftExists = activeAndDraftStrategies.some(strategy => strategy.state === 'Черновик')
        if (draftExists) {
            console.warn('Черновик уже существует')
            setModalAlertOpen(true)
        }
        else saveNewStrategy()
    }


    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Стратегии'}>Личный помощник</Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> Выберите Стратегию: </div>
                            <div className={classes.right}>

                                <>
                                    <ul className={classes.selectList}>
                                        {activeAndDraftStrategies?.map((item, index) => (
                                            <li key={index}
                                                style={{ color: item?.state === 'Активный' ? '#005475' : 'none' }}
                                                onClick={() => navigate(item.id)}
                                            >
                                                Стратегия №{item?.strategyNumber}
                                            </li>
                                        ))}
                                        <div className={classes.addDraft} onClick={() => createNew()}>
                                            <span>
                                                Создать
                                            </span>
                                            <img
                                                alt='addIcon'
                                                src={addIcon}

                                            />
                                        </div>
                                        {archiveStrategies?.map((item, index) => (
                                            <li key={index} style={{ color: 'grey' }} onClick={() => navigate(item.id)}>
                                                Стратегия №{item?.strategyNumber}
                                            </li>
                                        ))}

                                    </ul>
                                </>

                            </div>
                        </div>
                    </>


                </div>
            </div>

            {modalAlertOpen && (
                <AlertDraftIsExists setModalOpen={setModalAlertOpen}></AlertDraftIsExists>
            )}

            <HandlerQeury
                Loading={isLoadingStrategy}
                Error={isErrorStrategy}
            />

            <HandlerMutation
                Loading={isLoadingPostStrategyMutation}
                Error={isErrorPostStrategyMutation && !manualErrorReset}
                Success={isSuccessPostStrategyMutation && !manualSuccessReset}
                textSuccess={'Стратегия успешно создана'}
                textError={
                    errorPostStrategyMutation?.data?.errors?.[0]?.errors?.[0]
                        ? errorPostStrategyMutation.data.errors[0].errors[0]
                        : errorPostStrategyMutation?.data?.message
                }
            />

        </>
    );
};

export default MainStrategy;