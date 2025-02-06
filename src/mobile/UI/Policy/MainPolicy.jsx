import React, { useState } from 'react';
import edit from '../Custom/icon/icon _ edit _ grey.svg'
import classes from './MainPolicy.module.css'
import add from '../Custom/icon/icon _ add _ 005476.svg'
import { useNavigate } from "react-router-dom";
import Header from "../Custom/CustomHeader/Header";
import sublist from '../Custom/icon/icon _ sublist.svg'
import leftArrow from '../Custom/icon/icon _ leftarrow.svg'
import rightArrow from '../Custom/icon/icon _ rightarrow.svg'
import HandlerQeury from '../Custom/HandlerQeury';
import HandlerMutation from '../Custom/HandlerMutation';
import { usePolicyHook } from '@hooks';
import { usePolicyDirectoriesHook } from '@hooks';
import { useGetReduxOrganization } from '@hooks'



const MainPolicy = () => {

    const navigate = useNavigate()
    const [openDirectories, setOpenDirectories] = useState()
    const [openInstruction, setOpenInstruction] = useState(false)
    const [openDirectives, setOpenDirectives] = useState(true)
    const [typeDisplayDirectives, setTypeDisplayDirectives] = useState(1)
    const [typeDisplayInstruction, setTypeDisplayInstruction] = useState(1)

    const [manualSuccessReset, setManualSuccessReset] = useState(false)
    const [manualErrorReset, setManualErrorReset] = useState(false)

    const {organizationsId} = useGetReduxOrganization()

    const {
        activeDirectives,
        draftDirectives,
        archiveDirectives,
        activeInstructions,
        draftInstructions ,
        archiveInstructions,
        isLoadingGetPolicies,
        isErrorGetPolicies,


        postPolicy,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,

    } = usePolicyHook({organizationsId: organizationsId})
 

    const TYPE_DISPLAY = {
        0: { type: 'Отменён', arrayDirectives: archiveDirectives, arrayInstruction: archiveInstructions },
        1: { type: 'Активный', arrayDirectives: activeDirectives, arrayInstruction: activeInstructions },
        2: { type: 'Черновик', arrayDirectives: draftDirectives, arrayInstruction: draftInstructions },
    }
    const displayDirectives = TYPE_DISPLAY[typeDisplayDirectives]
    const displayInstruction = TYPE_DISPLAY[typeDisplayInstruction]


    const {
        policyDirectories,
        isLoadingPolicyDirectories,
        isErrorPolicyDirectories,
    } = usePolicyDirectoriesHook()

    console.log('policyDirectories ', policyDirectories)
    const savePolicy = async () => {
        await postPolicy()
            .unwrap()
            .then((result) => {
                navigate(result?.id)
                setManualSuccessReset(false);
                setManualErrorReset(false);
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };


    const switchDisplayType = (direction, type) => {
        const directionValue = direction === 'right' ? 1 : -1
        if (type === 'directives') {
            setTypeDisplayDirectives(prevState => {
                const newValue = (prevState + directionValue + 3) % 3;
                return newValue;
            });
        }
        else if (type === 'instruction') {
            setTypeDisplayInstruction(prevState => {
                const newValue = (prevState + directionValue + 3) % 3;
                return newValue;
            });
        }
    }

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Политики'} onRightIcon={true} rightIconClick={savePolicy}> Личный Помощник</Header>
                    {/* <div className={classes.iconAdd}>
                        <img src={iconAdd} alt="" onClick={() => savePolicy()} />
                    </div> */}
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> Выберите Политику:</div>
                            <div className={classes.right}>
                                <div
                                    className={classes.title}
                                    onClick={() => setOpenInstruction(!openInstruction)}
                                >
                                    <div>
                                        <span>Инструкции</span>
                                        <img src={sublist} alt='sublist' style={{ transform: !openInstruction ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div>
                                {openInstruction && (
                                    <>
                                        <div className={classes.selectType}>
                                            <div
                                                className={classes.imageContainer}
                                                onClick={() => switchDisplayType('left', 'instruction')}
                                            >
                                                <img src={leftArrow} alt="leftarrow" />
                                            </div>
                                            <span
                                            >
                                                {/* {TYPE_DISPLAY[typeDisplayDirectives].type} */}
                                                {displayInstruction.type}
                                            </span>
                                            <div
                                                className={classes.imageContainer}
                                                style={{ justifyContent: 'flex-end' }}
                                                onClick={() => switchDisplayType('right', 'instruction')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div>
                                        <ul className={classes.selectList}>
                                            {!displayInstruction.arrayInstruction.length > 0 && (
                                                <li
                                                    style={{ color: 'grey', fontStyle: 'italic' }}
                                                >
                                                    Политика отсутствует
                                                </li>
                                            )}
                                            {displayInstruction.arrayInstruction.map((item, index) => (
                                                <li
                                                    key={index}
                                                    // style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                                    onClick={() => navigate(item?.id)}
                                                >
                                                    {item?.policyName}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <div
                                    className={classes.title}
                                    onClick={() => setOpenDirectives(!openDirectives)}

                                >
                                    <div>
                                        <span>Директивы</span>
                                        <img src={sublist} alt='sublist' style={{ transform: !openDirectives ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div>
                                {openDirectives && (
                                    <>
                                        <div className={classes.selectType}>
                                            <div
                                                className={classes.imageContainer}
                                                onClick={() => switchDisplayType('left', 'directives')}
                                            >
                                                <img src={leftArrow} alt="leftarrow" />
                                            </div>
                                            <span
                                            >
                                                {/* {TYPE_DISPLAY[typeDisplayDirectives].type} */}
                                                {displayDirectives.type}
                                            </span>
                                            <div
                                                className={classes.imageContainer}
                                                style={{ justifyContent: 'flex-end' }}
                                                onClick={() => switchDisplayType('right', 'directives')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div>
                                        <ul className={classes.selectList}>
                                            {!displayDirectives.arrayDirectives.length > 0 && (
                                                <li
                                                    style={{ color: 'grey', fontStyle: 'italic' }}
                                                >
                                                    Политика отсутствует
                                                </li>
                                            )}
                                            {displayDirectives.arrayDirectives?.map((item, index) => (
                                                <li
                                                    key={index}
                                                    // style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                                    onClick={() => navigate(item?.id)}
                                                >
                                                    {item?.policyName}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <div
                                    className={classes.title}
                                // onClick={() => setOpenDirectories(!openDirectories)}
                                >
                                    <div>
                                        <span>Подборки</span>
                                        <img
                                            src={add}
                                            alt='add'
                                            style={{ width: '20px', height: '20px' }}
                                            onClick={() => navigate('createDirectory')}
                                        />
                                    </div>
                                </div>
                                <ul className={classes.selectList}>
                                    {policyDirectories?.mobileData?.map((item, index) => (
                                        <>
                                            <li
                                                key={index}
                                                className={item?.id === openDirectories ? `${classes.selectedDirectory}` : ''}
                                                onClick={() => setOpenDirectories(item.id)}
                                            >
                                                {item?.directoryName}
                                            </li>

                                            {item?.id === openDirectories && (
                                                <>
                                                    <div
                                                        className={classes.directoryMenu}
                                                        onClick={() => navigate(`EditDirectory/${item.id}`)}
                                                    >
                                                        <span>Редактировать</span>
                                                        <img src={edit} alt="edit" />
                                                    </div>
                                                    {item?.policies?.map((item, index) => (
                                                        <ol
                                                            onClick={() => navigate(item?.id)}
                                                        >
                                                            {item?.policyName}
                                                        </ol>
                                                    ))}
                                                </>
                                            )}

                                        </>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    </>
                </div>
            </div>

            <HandlerQeury
                Loading={isLoadingGetPolicies}
                Error={isErrorGetPolicies}
            />

            <HandlerQeury
                Loading={isLoadingPolicyDirectories}
                Error={isErrorPolicyDirectories}
            />

            <HandlerMutation
                Loading={isLoadingPostPoliciesMutation}
                Success={isSuccessPostPoliciesMutation && !manualSuccessReset}
                textSuccess={'Политика успешно создана'}
                Error={isErrorPostPoliciesMutation && !manualErrorReset}
                textError={
                    ErrorPostPoliciesMutation?.data?.errors?.[0]?.errors?.[0]
                        ? ErrorPostPoliciesMutation.data.errors[0].errors[0]
                        : ErrorPostPoliciesMutation?.data?.message
                }
            />
        </>
    );
};

export default MainPolicy;