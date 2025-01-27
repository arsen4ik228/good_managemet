import React, { useState } from 'react'
import { useMemo } from 'react'
import Header from '../../Custom/CustomHeader/Header'
import classes from "./CreatePolicyDirectory.module.css"
import { useNavigate } from 'react-router-dom'
import HandlerMutation from '../../Custom/HandlerMutation'
import { usePoliceDirectoriesHook } from '../../../hooks/usePolicyDirectoriesHook'
import HandlerQeury from '../../Custom/HandlerQeury'
import { ButtonContainer } from '../../Custom/CustomButtomContainer/ButtonContainer'
import { usePolicyHook } from '../../../hooks/usePolicyHook'

export default function CreatePolicyDirectory() {

    const navigate = useNavigate()
    const [selectedId, setSelectedId] = useState([])
    const [directoryName, setDirectoryName] = useState('')
    const [searchTerm, setSearchTerm] = useState('');


    const {
        activeDirectives,
        activeInstructions,
        isLoadingGetPolicies,
        isErrorGetPolicies,
    } = usePolicyHook()

    const {

        postDirectory,
        isLoadingUpdatePoliciesMutation,
        isSuccessUpdatePoliciesMutation,
        isErrorUpdatePoliciesMutation,
        ErrorUpdatePoliciesMutation,

    } = usePoliceDirectoriesHook()


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


    const savePolicyDirectory = async () => {
        await postDirectory({
            directoryName,
            policyToPolicyDirectories: selectedId,
        })
            .unwrap()
            .then((result) => {
                // reset();
                navigate(`/Policy/EditDirectory/${result?.id}`)
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header title={'Новая подборка политик'}>Личный помощник</Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.first}>
                            <input
                                placeholder=' Введите название'
                                type={'text'} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)} />
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
                                                <div>
                                                    {item?.policyName}
                                                </div>
                                                <input checked={selectedId.includes(item?.id)} type="checkbox" />
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
                                                <div>
                                                    {item?.policyName}
                                                </div>
                                                <input checked={selectedId.includes(item?.id)} type="checkbox" />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            </div>
                        </div>
                    </>
                </div>

                <ButtonContainer
                    clickFunction={savePolicyDirectory}
                >
                    создать
                </ButtonContainer>
            </div>

            <HandlerQeury
                Loading={isLoadingGetPolicies}
                Error={isErrorGetPolicies}
            />

            <HandlerMutation
                Loading={isLoadingUpdatePoliciesMutation}
                Error={isErrorUpdatePoliciesMutation}
                Success={isSuccessUpdatePoliciesMutation}
                textSuccess={"Подборка политик успешко создана"}
                textError={ErrorUpdatePoliciesMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>

        </>
    )
}
