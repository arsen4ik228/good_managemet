import React, { useEffect, useState } from 'react';
import classes from './Policy.module.css';
import { useParams } from "react-router-dom";
import Header from "@Custom/CustomHeader/Header";
import HandlerMutation from "@Custom/HandlerMutation";
import AlertUpdateData from '@Custom/AlertUpdateData/AlertUpdateData';
import Mdxeditor from '@Custom/MDXEditorMobile/Mdxeditor';
import { notEmpty } from '@helpers/helpers';
import { usePolicyHook } from '@hooks';
import HandlerQeury from '@Custom/HandlerQeury';
import { ButtonContainer } from '@Custom/CustomButtomContainer/ButtonContainer';


const MobilePolicy = () => {

    const { userId, policyId } = useParams()
    const [editorState, setEditorState] = useState('');
    const [valueType, setValueType] = useState('')
    const [policyState, setPolicyState] = useState('')
    const [inputValue, setInputValue] = useState('');
    const [openAlertModal, setOpenAlertModal] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const {
        currentPolicy,
        isLoadingGetPoliciesId,
        isErrorGetPoliciesId,


        updatePolicy,
        isLoadingUpdatePoliciesMutation,
        isSuccessUpdatePoliciesMutation,
        isErrorUpdatePoliciesMutation,
        ErrorUpdatePoliciesMutation,
    } = usePolicyHook(policyId)


    useEffect(() => {
        if (!notEmpty(currentPolicy)) return
        setInputValue(currentPolicy.policyName === 'Политика' ? `Политика №${currentPolicy.policyNumber}` : currentPolicy.policyName);
        currentPolicy.type === 'Инструкция' ? setValueType('Инструкция') : setValueType('Директива');
        setPolicyState(currentPolicy.state)
        if (currentPolicy.state === 'Отменён') setDisabled(true)
    }, [policyId, currentPolicy])


    const saveUpdatePolicy = async () => {
        const Data = {}
        if (inputValue !== currentPolicy.policyName) Data.policyName = inputValue
        if (policyState !== currentPolicy.state) Data.state = policyState
        if (valueType !== currentPolicy.type) Data.type = valueType
        if (editorState !== currentPolicy.content) Data.content = editorState
        console.log(Data)
        if (notEmpty(Data)) {
            await updatePolicy({
                _id: policyId,
                ...Data,
            })
                .unwrap()
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
                });
        }
        else {
            console.log('Проверка не прошла')
            setOpenAlertModal(true)
        }
    };

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Политики'}>Личный помощник</Header>
                </>

                <div className={classes.inputRow1}>

                    <div className={classes.first}>
                        <input value={inputValue} disabled={disabled} type={'text'} onChange={(e) => setInputValue(e.target.value)} />
                    </div>

                    <div className={classes.second}>
                        <select value={valueType} disabled={disabled} onChange={(e) => setValueType(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value='Директива'> Директива</option>
                            <option value='Инструкция'> Инструкция</option>
                        </select>
                        <select value={policyState} disabled={disabled} onChange={(e) => setPolicyState(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value='Черновик'>Черновик</option>
                            <option value='Активный'> Активный</option>
                            <option value='Отменён'> Отменён</option>
                        </select>
                    </div>
                </div>

                <div className={classes.body}>
                    {Object.keys(currentPolicy).length > 0 && (
                        <>
                            {/* <MyEditor
                            editorState={editorState}
                            setEditorState={disabled ? '' : setEditorState}
                            policyContent={true}
                        /> */}
                            <Mdxeditor
                                key={currentPolicy?.id}
                                editorState={currentPolicy?.content}
                                setEditorState={setEditorState}
                                userId={userId}
                                isArchive={disabled}
                            >
                            </Mdxeditor>
                        </>
                    )}
                </div>

                {!disabled && (
                    <ButtonContainer
                        clickFunction={saveUpdatePolicy}
                    >
                        сохранить
                    </ButtonContainer>
                )}
            </div>

            <HandlerQeury
                Loading={isLoadingGetPoliciesId}
                Error={isErrorGetPoliciesId}
            />

            <HandlerMutation
                Loading={isLoadingUpdatePoliciesMutation}
                Error={isErrorUpdatePoliciesMutation}
                Success={isSuccessUpdatePoliciesMutation}
                textSuccess={"Политика успешно сохранена."}
                textError={ErrorUpdatePoliciesMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>
            {openAlertModal && <AlertUpdateData setModalOpen={setOpenAlertModal}></AlertUpdateData>}
        </>
    );
};

export default MobilePolicy;