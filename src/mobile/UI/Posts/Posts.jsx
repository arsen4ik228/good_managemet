import React, { useState, useEffect } from 'react';
import classes from './Posts.module.css';
import stats from './icon/_icon _ stats.svg'
import attachpolicy from './icon/icon _ attach policy.svg'
import { useNavigate, useParams } from "react-router-dom";
import HandlerMutation from "../Custom/HandlerMutation";
import HandlerQeury from "../Custom/HandlerQeury.jsx";
import Header from "../Custom/CustomHeader/Header";
import AttachPolicy from '../Custom/AttachPolicy/AttachPolicy.jsx';
import { ButtonContainer } from '../Custom/CustomButtomContainer/ButtonContainer.jsx';
import { notEmpty } from '@helpers/helpers';
import { usePostsHook } from '@hooks';


const Posts = () => {

    const navigate = useNavigate();
    const { postId } = useParams();

    const [postName, setPostName] = useState(null);
    const [postNameChanges, setPostNameChanges] = useState(false);
    const [divisionName, setDivisionName] = useState(null);
    const [parentDivisionName, setParentDivisionName] = useState(null)
    const [parentId, setParentId] = useState(null)
    const [product, setProduct] = useState(null);
    const [isProductChanges, setIsProductChanges] = useState(false);
    const [purpose, setPurpose] = useState(null);
    const [isPurposeChanges, setIsPurposeChanges] = useState(false);
    const [worker, setWorker] = useState(null);
    const [policy, setPolicy] = useState(null)

    const [currentPolicyName, setCurrentPolicyName] = useState(null)
    const [modalPolicyOpen, setModalPolicyOpen] = useState(false)

    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);

    const {
        currentPost,
        workers,
        posts,
        parentPost,
        policiesActive,
        statisticsIncludedPost,
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,

        updatePost,
        isLoadingUpdatePostMutation,
        isSuccessUpdatePostMutation,
        isErrorUpdatePostMutation,
        ErrorUpdatePostMutation
    } = usePostsHook(postId)


    useEffect(() => {
        if (currentPost && notEmpty(currentPost)) {
            setPostName(currentPost?.postName);
            setDivisionName(currentPost?.divisionName);
            setWorker(currentPost?.user?.id);
            setParentId(currentPost?.parentId);
            setPolicy(currentPost?.policy?.id);
        }
    }, [currentPost]);

    useEffect(() => {
        const foundPolicy = policiesActive?.find(item => item.id === policy);
        if (foundPolicy) setCurrentPolicyName(foundPolicy.policyName)
        else setPolicy(null)
    }, [policy]);

    useEffect(() => {
        if (parentPost && notEmpty(parentPost)) {
            setParentDivisionName(parentPost?.divisionName)
        }
    }, [parentPost])

    const reset = () => {
        setPostName(null);
        setDivisionName(null);
        setProduct(null);
        setPurpose(null);
        setWorker(null);
        setParentId(null)
        setPolicy(null)
        setIsProductChanges(false);
        setIsPurposeChanges(false);
        setPostNameChanges(false);
    }

    const selectedParentPost = (id) => {
        setParentId(id);
        if (id) {
            const obj = posts.find(
                (item) => item.id === id
            );
            setParentDivisionName(obj?.divisionName)
        }
    }

    const saveUpdatePost = async () => {
        // Создаем объект с измененными полями
        const updatedData = {};

        // Проверки на изменения и отсутствие null
        if (postName !== currentPost.postName && postName !== null) {
            updatedData.postName = postName;
        }
        if (divisionName !== currentPost.divisionName && divisionName !== null) {
            updatedData.divisionName = divisionName;
        }
        if (isProductChanges || (product !== currentPost.product && product !== null)) {
            updatedData.product = product;
        }
        if (isPurposeChanges || (purpose !== currentPost.purpose && purpose !== null)) {
            updatedData.purpose = purpose;
        }
        if (worker !== currentPost?.user?.id) {
            updatedData.responsibleUserId = worker;
        }
        if (parentId !== currentPost?.parentId) {
            updatedData.parentId = parentId
        }
        if (policy !== currentPost?.policyId) {
            updatedData.policyId = policy
        }
        console.log(JSON.stringify(updatedData));
        // Проверяем, если есть данные для обновления
        if (Object.keys(updatedData).length > 0) {
            await updatePost({
                _id: postId,
                ...updatedData, // отправляем только измененные поля
            })
                .unwrap()
                .then((result) => {
                    setManualSuccessReset(false);
                    setManualErrorReset(false);
                    // reset();
                })
                .catch((error) => {
                    reset();
                    setManualErrorReset(false);
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        } else {
            console.log("Нет изменений для обновления");
        }
    };

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Редактировать Пост'}>Личный помощщник</Header>
                </>

                <div className={classes.body}>

                    <>
                        <div className={classes.bodyContainer}>
                            <input
                                className={classes.first}
                                type={'text'}
                                value={postName}
                                onChange={(e) => {
                                    setPostName(e.target.value);
                                }}
                            />
                        </div>
                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Подразделение
                            </div>
                            {(parentId && !currentPost.isHasChildPost) ?
                                (
                                    <div className={classes.selectSection}>
                                        <input
                                            type="text"
                                            value={parentDivisionName}
                                            disabled
                                        />
                                    </div>

                                ) : (
                                    <div className={classes.selectSection}>
                                        <input
                                            type="text"
                                            value={divisionName}
                                            onChange={(e) => {
                                                setDivisionName(e.target.value);
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Руководитель
                            </div>
                            <div className={classes.selectSection}>
                                <select
                                    name="mySelect"
                                    className={classes.select}
                                    value={parentId}
                                    onChange={(e) => {
                                        selectedParentPost(e.target.value === '' ? null : e.target.value);
                                    }}
                                >
                                    <option value='' >
                                        Выберите опцию
                                    </option>
                                    {posts?.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>
                                                {item.postName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Сотрудник
                            </div>
                            <div className={classes.selectSection}>
                                <select
                                    name="mySelect"
                                    className={classes.select}
                                    value={worker}
                                    onChange={(e) => {
                                        setWorker(e.target.value === '' ? null : e.target.value);
                                    }}
                                >
                                    <option value=''>
                                        Выберите опцию
                                    </option>
                                    {workers?.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>
                                                {`${item.firstName} ${item.lastName}`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Прикрепить политику
                                    </div>
                                    <div className={classes.selectSection}>
                                        <input type="text" value={policyGet?.policyName} disabled/>
                                    </div>
                                </div> */}
                    </>


                    <div className={classes.main}>
                        <>
                            {isErrorGetPostId ? (
                                <HandlerQeury Error={isErrorGetPostId}></HandlerQeury>
                            ) : (
                                <>

                                    {isLoadingGetPostId || isFetchingGetPostId ? (
                                        <HandlerQeury
                                            Loading={isLoadingGetPostId}
                                            Fetching={isFetchingGetPostId}
                                        ></HandlerQeury>
                                    ) : (
                                        <>
                                            {currentPost.id ? (
                                                <>
                                                    <div className={classes.productTeaxtaera}>
                                                        <textarea
                                                            className={classes.Teaxtaera}
                                                            placeholder="Описание продукта поста"
                                                            value={isProductChanges ? product : (product || currentPost.product)}
                                                            onChange={(e) => {
                                                                setProduct(e.target.value);
                                                                setIsProductChanges(true);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className={classes.destinyTeaxtaera}>
                                                        <textarea
                                                            className={classes.Teaxtaera}
                                                            placeholder="Описнаие предназначения поста"
                                                            value={isPurposeChanges ? purpose : (purpose || currentPost.purpose)}
                                                            onChange={(e) => {
                                                                setPurpose(e.target.value);
                                                                setIsPurposeChanges(true);
                                                            }}
                                                        />
                                                    </div>

                                                    <div
                                                        className={classes.post}
                                                        onClick={() => setModalPolicyOpen(true)}
                                                    >
                                                        <img src={attachpolicy} alt="blackStatistic" />
                                                        <div>
                                                            {policy !== null ?
                                                                (
                                                                    <span className={classes.nameButton}>
                                                                        Прикреплено: {currentPolicyName}
                                                                    </span>
                                                                ) : (
                                                                    <span className={classes.nameButton}>
                                                                        Прикрепить политику
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={classes.post}
                                                        onClick={() => navigate('attachStatistics')}
                                                    >
                                                        <img src={stats} alt="blackStatistic" />
                                                        <div>
                                                            {statisticsIncludedPost?.length > 0 ?
                                                                (
                                                                    <span className={classes.nameButton}>
                                                                        Статистика: {' '} {statisticsIncludedPost[0]?.name}
                                                                        {statisticsIncludedPost?.length > 1 ?
                                                                            (
                                                                                <span>
                                                                                    {' '} и ещё ({statisticsIncludedPost?.length - 1})
                                                                                </span>
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                    </span>
                                                                ) : (
                                                                    <span className={classes.nameButton}>
                                                                        Выбрать или создать статистику для поста
                                                                    </span>
                                                                )}

                                                        </div>
                                                    </div>
                                                    <HandlerMutation
                                                        Loading={isLoadingUpdatePostMutation}
                                                        Error={isErrorUpdatePostMutation && !manualErrorReset} // Учитываем ручной сброс
                                                        Success={
                                                            isSuccessUpdatePostMutation && !manualSuccessReset
                                                        } // Учитываем ручной сброс
                                                        textSuccess={"Пост обновлен"}
                                                        textError={ErrorUpdatePostMutation?.data?.errors[0]?.errors}
                                                    ></HandlerMutation>
                                                </>
                                            ) : (
                                                <> Выберите пост </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>

                    </div>

                </div>

                <ButtonContainer
                    clickFunction={saveUpdatePost}
                >Сохранить

                </ButtonContainer>
            </div>

            {modalPolicyOpen &&
                <AttachPolicy
                    setModalOpen={setModalPolicyOpen}
                    title={'Политики'}
                    firstArray={policiesActive}
                    componentName={'policyName'}
                    id={policy}
                    setIds={setPolicy}
                >
                </AttachPolicy>}

        </>
    );
};

export default Posts;