import React, { useEffect, useState, useMemo } from 'react'
import Header from '../../Custom/CustomHeader/Header'
import classes from "./EditPolicyDirectory.module.css"
import { useNavigate, useParams } from 'react-router-dom'
import HandlerMutation from '../../Custom/HandlerMutation'
import { usePolicyDirectoriesHook } from '@hooks'
import HandlerQeury from '../../Custom/HandlerQeury'

export default function EditPolicyDirectories() {

    const { policyDirectoryId } = useParams()
    const navigate = useNavigate()
    const [selectedId, setSelectedId] = useState([])
    const [directoryName, setDirectoryName] = useState('')
    const [searchTerm, setSearchTerm] = useState('');

    const {
        activeDirectives,
        activeInstructions,
        policyDirectory,
        isLoadingGetPolicyDirectories,
        isErrorGetPolicyDirectories,


        deletePolicyDirectories,
        isLoadingDeletePolicyDirectoriesMutation,
        isSuccessDeletePolicyDirectoriesMutation,
        isErrorDeletePolicyDirectoriesMutation,
        ErrorDeleteDirectories,


        updatePolicyDirectories,
        isLoadingUpdatePolicyDirectoriesMutation,
        isSuccessUpdatePolicyDirectoriesMutation,
        isErrorUpdatePolicyDirectoriesMutation,
        ErrorUpdateDirectories,
    } = usePolicyDirectoriesHook(policyDirectoryId)



    useEffect(() => {
        if (Object.keys(policyDirectory).length > 0) {
            setDirectoryName(policyDirectory.directoryName)
            if (policyDirectory?.policies?.length > 0) {
                setSelectedId(prevSelectedId =>
                    [...prevSelectedId, ...policyDirectory?.policies?.map(item => item.id)]
                );
            }
        }
    }, [policyDirectory])

    const handleSelectItem = (id) => {
        setSelectedId(prevSelectedId =>
            prevSelectedId.includes(id)
                ? prevSelectedId.filter(item => item !== id)
                : [...prevSelectedId, id]
        )
    };


    const filteredItems = useMemo(() => {
        const filterActiveDirectives = activeDirectives.filter(item =>
            item.policyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filterActiveInstructions = activeInstructions.filter(item =>
            item.policyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
            activeDirectives: filterActiveDirectives,
            activeInstructions: filterActiveInstructions
        };
    }, [activeDirectives, activeInstructions, searchTerm]);

    const updatePolicyDirectory = async () => {
        await updatePolicyDirectories({
            policyDirectoryId,
            directoryName,
            policyToPolicyDirectories: selectedId,
        })
            .unwrap()
            .then(() => {

            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    const deletePolicyDirectory = async () => {
        await deletePolicyDirectories({
            policyDirectoryId,
        })
            .unwrap()
            .then(() => {
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            })

            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    }

    console.log(policyDirectory)
    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Редактировать подборку политик'}>Личный помощник</Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.first}>
                            <input type={'text'} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)} />
                        </div>
                        <div className={classes.element_srch}>
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={classes.bodyContainer}>

                            <div className={classes.left}>
                                <div
                                    className={classes.title}
                                // onClick={() => setOpenDirectives(!openDirectives)}

                                >
                                    <div>
                                        <span>Директивы</span>
                                        {/* <img src={sublist} alt='sublist' style={{ transform: !openDirectives ? 'rotate(90deg)' : 'none' }} /> */}
                                    </div>
                                </div>

                                <>

                                    <ul className={classes.selectList}>
                                        {!filteredItems.activeDirectives.length > 0 && (
                                            <li
                                                style={{ color: 'grey', fontStyle: 'italic' }}
                                            >
                                                Политика отсутствует
                                            </li>
                                        )}
                                        {filteredItems.activeDirectives?.map((item, index) => (
                                            <li
                                                key={index}
                                                style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                                onClick={() => handleSelectItem(item?.id)}
                                            >
                                                <span>
                                                    {item?.policyName}
                                                </span>
                                                <input
                                                    readOnly
                                                    checked={selectedId.includes(item?.id)}
                                                    type="checkbox" />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            </div>
                            <div className={classes.right}>
                                <div
                                    className={classes.title}
                                >
                                    <div>
                                        <span>Инструкции</span>
                                        {/* <img src={sublist} alt='sublist' style={{ transform: !openInstruction ? 'rotate(90deg)' : 'none' }} /> */}
                                    </div>
                                </div>

                                <>
                                    {/* <div className={classes.selectType}>
                                            <div
                                                className={classes.imageContainer}
                                                onClick={() => switchDisplayType('left', 'instruction')}
                                            >
                                                <img src={leftArrow} alt="leftarrow" />
                                            </div>
                                            <span
                                            >
                                                {displayInstruction.type}
                                            </span>
                                            <div
                                                className={classes.imageContainer}
                                                style={{ justifyContent: 'flex-end' }}
                                                onClick={() => switchDisplayType('right', 'instruction')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div> */}
                                    <ul className={classes.selectList}>
                                        {!filteredItems.activeInstructions.length > 0 && (
                                            <li
                                                style={{ color: 'grey', fontStyle: 'italic' }}
                                            >
                                                Политика отсутствует
                                            </li>
                                        )}
                                        {filteredItems.activeInstructions.map((item, index) => (
                                            <li
                                                key={index}
                                                style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                                onClick={() => handleSelectItem(item?.id)}
                                            >
                                                <span>
                                                    {item?.policyName}
                                                </span>
                                                <input
                                                    readOnly
                                                    checked={selectedId.includes(item?.id)} type="checkbox" />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            </div>
                        </div>
                    </>
                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div>
                            <button className={classes.addButton} onClick={() => updatePolicyDirectory()}>CОХРАНИТЬ</button>
                        </div>
                        <div>
                            <button className={classes.deleteButton} onClick={() => deletePolicyDirectory()}>УДАЛИТЬ</button>
                        </div>
                    </div>
                </footer>
            </div>

            <HandlerQeury
                Loading={isLoadingGetPolicyDirectories}
                Error={isErrorGetPolicyDirectories}
            />

            <HandlerMutation
                Loading={isLoadingDeletePolicyDirectoriesMutation}
                Error={isErrorDeletePolicyDirectoriesMutation}
                Success={isSuccessDeletePolicyDirectoriesMutation}
                textSuccess={"Подборка политик успешно удалена"}
                textError={ErrorDeleteDirectories?.data?.errors[0]?.errors}
            ></HandlerMutation>
            <HandlerMutation
                Loading={isLoadingUpdatePolicyDirectoriesMutation}
                Error={isErrorUpdatePolicyDirectoriesMutation}
                Success={isSuccessUpdatePolicyDirectoriesMutation}
                textSuccess={"Подборка политик успешно обновлена"}
                textError={ErrorUpdateDirectories?.data?.errors[0]?.errors}
            ></HandlerMutation>

        </>
    )
}
