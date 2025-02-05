import React, { useState, useEffect, useRef } from "react";
import classes from "./Post.module.css";
import greyPolicy from "@image/greyPolicy.svg";
import blackStatistic from "@image/blackStatistic.svg";
import { useNavigate } from "react-router-dom";
import {
  useGetPostIdQuery,
  useGetPostsQuery,
  useUpdatePostsMutation,
} from "@BLL/postApi.js";
import {
  usePostStatisticsMutation,
  useUpdateStatisticsToPostIdMutation,
} from "@BLL/statisticsApi.js";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import WaveLetters from "@Custom/WaveLetters.jsx";
import { useSelector } from "react-redux";
import ModalWindow from "@Custom/ModalWindow.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import Select from "@Custom/Select/Select";
import Input from "@Custom/Input/Input";
import Lupa from "@Custom/Lupa/Lupa";
import { useModalSelectRadio } from "@hooks/useModalSelectRadio";
import { ModalSelectRadio } from "@Custom/modalSelectRadio/ModalSelectRadio";
import { useModalCheckBoxStatistic } from "@hooks/useModalCheckBoxStatistic";
import { ModalSelectedStatistic } from "@Custom/modalSelectedStatistic/ModalSelectedStatistic";
import useGetOldAndNewOrganizationId from "@hooks/useGetReduxOrganization";

export default function Post() {
  const navigate = useNavigate();

  const newPost = () => {
    navigate(`/pomoshnik/postNew`);
  };

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);

  const createdId = useSelector((state) => state.post.postCreatedId);

  const [postName, setPostName] = useState(null);
  const [divisionName, setDivisionName] = useState(null);
  const [disabledDivisionName, setDisabledDivisionName] = useState(false);
  const [parentPostId, setParentPostId] = useState(null);
  const [worker, setWorker] = useState(null);

  const [product, setProduct] = useState(null);
  const [isProductChanges, setIsProductChanges] = useState(false);

  const [purpose, setPurpose] = useState(null);
  const [isPurposeChanges, setIsPurposeChanges] = useState(false);

  const [selectParentPost, setSelectParentPost] = useState();
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [openModalPolicy, setOpenModalPolicy] = useState(false);

  //Статистика
  const [statisticsChecked, setStatisticsChecked] = useState([]);
  const [disabledStatisticsChecked, setDisabledStatisticsChecked] = useState(
    []
  );
  const [openModalStatistic, setOpenModalStatistic] = useState(false);
  const [openModalStatisticWarning, setOpenModalStatisticWarning] =
    useState(false);
  const [openModalStatisticSave, setOpenModalStatisticSave] = useState(false);
  const [manualSuccessResetStatistic, setManualSuccessResetStatistic] =
    useState(false);
  const [manualErrorResetStatistic, setManualErrorResetStatistic] =
    useState(false);

  const { reduxNewSelectedOrganizationId } = useGetOldAndNewOrganizationId();

  const {
    data = [],
    isLoadingGetPosts,
    isErrorGetPosts,
  } = useGetPostsQuery(
    { organizationId: reduxNewSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        data: data || [],
        isLoadingGetPosts: isLoading,
        isErrorGetPosts: isError,
      }),
    }
  );

  const {
    currentPost = {},
    workers = [],
    policies = [],
    selectedPolicyIDInPost = null,
    selectedPolicyNameInPost = null,
    posts = [],
    parentPost = {},
    statisticsIncludedPost = [],
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
    refetch: refetchPostIdQuery,
  } = useGetPostIdQuery(
    { postId: selectedPostId },
    {
      selectFromResult: ({
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
      }) => ({
        currentPost: data?.currentPost || {},
        workers: data?.workers || [],
        policies: data?.policies || [],
        posts: data?.posts || [],
        parentPost: data?.parentPost || {},
        selectedPolicyIDInPost: data?.selectedPolicyIDInPost || null,
        selectedPolicyNameInPost: data?.selectedPolicyNameInPost || null,
        statisticsIncludedPost: data?.statisticsIncludedPost || [],
        isLoadingGetPostId: isLoading,
        isErrorGetPostId: isError,
        isFetchingGetPostId: isFetching,
        refetch,
      }),
      skip: !selectedPostId,
    }
  );

  const [
    updatePost,
    {
      isLoading: isLoadingUpdatePostMutation,
      isSuccess: isSuccessUpdatePostMutation,
      isError: isErrorUpdatePostMutation,
      error: ErrorUpdatePostMutation,
    },
  ] = useUpdatePostsMutation();

  const [
    updateStatisticsToPostId,
    {
      isLoading: isLoadingStatisticsToPostIdMutation,
      isSuccess: isSuccessUpdateStatisticsToPostIdMutation,
      isError: isErrorUpdateStatisticsToPostIdMutation,
      error: ErrorUpdateStatisticsToPostIdMutation,
    },
  ] = useUpdateStatisticsToPostIdMutation();

  const methodForLupa = (parametr) => {
    setManualSuccessResetStatistic(true);
    setManualErrorResetStatistic(true);
    setIsOpenSearch(parametr);
  };


  useEffect(() => {
    if (createdId) {
      setSelectedPostId(createdId);
    }
  }, []);
  // Конец

  useEffect(() => {
    const obj =
      parentPostId !== ""
        ? posts?.find((item) => item.id === parentPostId)
        : null;

    setSelectParentPost(obj);

    if (parentPostId && currentPost?.isHasChildPost === false) {
      setDivisionName(obj?.divisionName || "");
      setDisabledDivisionName(true);
    } else {
      setDivisionName(currentPost?.divisionName || "");
      setDisabledDivisionName(false);
    }
  }, [parentPostId]);

  useEffect(() => {
    if (currentPost.postName) {
      setPostName(currentPost.postName);
    }

    if (parentPost?.id && currentPost?.isHasChildPost === false) {
      setDivisionName(parentPost?.divisionName);
      setDisabledDivisionName(true);
    } else {
      setDivisionName(currentPost?.divisionName);
      setDisabledDivisionName(false);
    }

    if (currentPost?.user?.id) {
      setWorker(currentPost?.user?.id);
    } else {
      setWorker("");
    }

    if (parentPost?.id) {
      setParentPostId(parentPost?.id);
    } else {
      setParentPostId("");
    }

    if (statisticsIncludedPost) {
      const ids = statisticsIncludedPost.map((item) => item.id);
      setStatisticsChecked(ids);
      setDisabledStatisticsChecked(ids);
    } else {
      setStatisticsChecked([]);
    }

    if (selectedPolicyIDInPost !== null) {
      setSelectedPolicyID(selectedPolicyIDInPost);
      setSelectedPolicyName(selectedPolicyNameInPost);
    }
  }, [currentPost.id]);

  const saveUpdatePost = async () => {
    setManualSuccessResetStatistic(true);
    setManualErrorResetStatistic(true);

    // Создаем объект с измененными полями
    const updatedData = {};

    // Проверки на изменения и отсутствие null
    if (postName !== currentPost.postName && postName !== null) {
      updatedData.postName = postName;
    }
    if (
      divisionName !== currentPost.divisionName &&
      divisionName !== selectParentPost?.divisionName &&
      divisionName !== null
    ) {
      updatedData.divisionName = divisionName;
    }
    if (
      isProductChanges ||
      (product !== currentPost.product && product !== null)
    ) {
      updatedData.product = product;
    }
    if (
      isPurposeChanges ||
      (purpose !== currentPost.purpose && purpose !== null)
    ) {
      updatedData.purpose = purpose;
    }
    if (parentPostId !== parentPost?.id && parentPostId !== null) {
      updatedData.parentId = parentPostId === "" ? null : parentPostId;
    }

    if (worker !== currentPost?.user?.id && worker !== null) {
      updatedData.responsibleUserId = worker === "" ? null : worker;
    }

    if (selectedPolicyID !== selectedPolicyIDInPost) {
      updatedData.policyId =
        selectedPolicyID === null ? null : selectedPolicyID;
    }
    console.log(JSON.stringify(updatedData));
    // Проверяем, если есть данные для обновления
    if (Object.keys(updatedData).length > 0) {
      await updatePost({
        postId: selectedPostId,
        _id: selectedPostId,
        ...updatedData, // отправляем только измененные поля
      })
        .unwrap()
        .then(() => {
          setManualSuccessReset(false);
          setManualErrorReset(false);
        })
        .catch((error) => {
          setManualErrorReset(false);
          console.error("Ошибка:", JSON.stringify(error, null, 2));
        });
    } else {
      console.log("Нет изменений для обновления");
    }
  };

  const selectPost = (id) => {
    setManualSuccessReset(true);
    setManualErrorReset(true);
    setSelectedPostId(id);
    setIsOpenSearch(false);
  };

  // Политика
  const {
    selectedID: selectedPolicyID,
    setSelectedID: setSelectedPolicyID,

    selectedName: selectedPolicyName,
    setSelectedName: setSelectedPolicyName,

    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,
  } = useModalSelectRadio({ array: policies, arrayItem: "policyName" });

  useEffect(() => {
    const ids = statisticsIncludedPost.map((item) => item.id);
    setStatisticsChecked(ids);
    setDisabledStatisticsChecked(ids);
  }, [isFetchingGetPostId]);

  // Статистика
  const {
    statistics,
    isErrorStatistic,
    isLoadingStatistic,
    inputSearchModalStatistics,
    filterArraySearchModalStatistics,

    handleChecboxChangeStatistics,
    searchStatistics,
    resetStatisticsId,
  } = useModalCheckBoxStatistic({ openModalStatistic, setStatisticsChecked });

  const saveStatisticsId = async () => {
    setManualSuccessReset(true);
    setManualErrorReset(true);

    const data = statisticsChecked.filter((item) => {
      return !disabledStatisticsChecked
        .map((disabled) => disabled)
        .includes(item);
    });
    if (data.length > 0) {
      await updateStatisticsToPostId({
        postId: selectedPostId,
        ids: data,
      })
        .unwrap()
        .then(() => {
          resetStatisticsId();
          refetchPostIdQuery();
          setOpenModalStatisticWarning(false);
          setOpenModalStatisticSave(false);
          setManualSuccessResetStatistic(false);
          setManualErrorResetStatistic(false);
        })
        .catch((error) => {
          setManualErrorResetStatistic(false);
          console.error("Ошибка:", JSON.stringify(error, null, 2));
        });
    }
  };

  const exitStatistic = () => {
    setOpenModalStatistic(false);
    resetStatisticsId();
  };

  // Модальное окно статистики пиредупреждение что данные нужно сохранить
  const openStatisticWarning = () => {
    const data = statisticsChecked.filter((item) => {
      return !disabledStatisticsChecked
        .map((disabled) => disabled)
        .includes(item);
    });

    if (data.length > 0) {
      setManualSuccessResetStatistic(true);
      setManualErrorResetStatistic(true);
      setOpenModalStatisticWarning(true);
    } else {
      exitStatistic();
    }
  };

  const btnYes = () => {
    saveStatisticsId();
  };

  const btnNo = () => {
    setOpenModalStatisticWarning(false);
    exitStatistic();
  };

  const btnNoSave = () => {
    setOpenModalStatisticSave(false);
    exitStatistic();
  };

  // Переход к созданию статистики
  const [
    postStatistics,
    {
      isLoading: isLoadingPostStatisticMutation,
      isSuccess: isSuccessPostStatisticMutation,
      isError: isErrorPostStatisticMutation,
      error: Error,
    },
  ] = usePostStatisticsMutation();

  const createNewStatistic = async () => {
    await postStatistics({
      name: "Статистика",
      postId: selectedPostId,
    })
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  return (
    <div className={classes.dialog}>
      <Headers name={"посты"}>
        <BottomHeaders create={newPost} update={saveUpdatePost}>
          <Input
            name={"Название поста"}
            value={postName}
            onChange={setPostName}
          >
            <Lupa
              setIsOpenSearch={methodForLupa}
              isOpenSearch={isOpenSearch}
              select={selectPost}
              array={data}
              arrayItem={"postName"}
            ></Lupa>
          </Input>

          {currentPost.id && (
            <>
              <Input
                name={"Название подразделения"}
                value={divisionName}
                onChange={setDivisionName}
                disabledPole={disabledDivisionName}
              ></Input>
              <Select
                name={"Руководитель"}
                value={parentPostId}
                onChange={setParentPostId}
                array={posts}
                arrayItem={"postName"}
              ></Select>
              <Select
                name={"Сотрудник"}
                value={worker}
                onChange={setWorker}
                array={workers}
                arrayItem={"lastName"}
              ></Select>
            </>
          )}
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
        {isErrorGetPosts ? (
          <>
            <HandlerQeury Error={isErrorGetPosts}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetPostId ? (
              <HandlerQeury Error={isErrorGetPostId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury Loading={isLoadingGetPosts}></HandlerQeury>

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
                            placeholder="описание продукта поста"
                            value={
                              isProductChanges
                                ? product
                                : product || currentPost.product
                            }
                            onChange={(e) => {
                              setProduct(e.target.value);
                              setIsProductChanges(true);
                            }}
                          />
                        </div>

                        <div className={classes.destinyTeaxtaera}>
                          <textarea
                            className={classes.Teaxtaera}
                            placeholder="описнаие предназначения поста"
                            value={
                              isPurposeChanges
                                ? purpose
                                : purpose || currentPost.purpose
                            }
                            onChange={(e) => {
                              setPurpose(e.target.value);
                              setIsPurposeChanges(true);
                            }}
                          />
                        </div>

                        <div
                          className={classes.post}
                          onClick={() => setOpenModalPolicy(true)}
                        >
                          <img src={greyPolicy} alt="greyPolicy" />
                          <div className={classes.postNested}>
                            {selectedPolicyName ? (
                              <span className={classes.nameButton}>
                                Политика: {selectedPolicyName}
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
                          onClick={() => setOpenModalStatistic(true)}
                        >
                          <img src={blackStatistic} alt="blackStatistic" />

                          {statisticsIncludedPost.length > 0 ? (
                            <div className={classes.postNested}>
                              <span className={classes.nameButton}>
                                Статистики:{" "}
                                {statisticsIncludedPost.map((item, index) => (
                                  <span key={item.id}>
                                    {item.name}
                                    {index < statisticsIncludedPost.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className={classes.nameButton}>
                                Выбрать или создать статистику для поста
                              </span>
                            </div>
                          )}
                        </div>

                        {openModalPolicy && (
                          <ModalSelectRadio
                            nameTable={"Название политики"}
                            handleSearchValue={inputSearchModal}
                            handleSearchOnChange={handleInputChangeModalSearch}
                            handleRadioChange={handleRadioChange}
                            exit={() => {
                              setOpenModalPolicy(false);
                            }}
                            filterArray={filterArraySearchModal}
                            array={policies}
                            arrayItem={"policyName"}
                            selectedItemID={selectedPolicyID}
                          ></ModalSelectRadio>
                        )}

                        {isErrorStatistic ? (
                          <HandlerQeury Error={isErrorStatistic}></HandlerQeury>
                        ) : (
                          <>
                            <HandlerQeury
                              Loading={isLoadingStatistic}
                            ></HandlerQeury>
                            {!isErrorStatistic && (
                              <>
                                {openModalStatistic && (
                                  <ModalSelectedStatistic
                                    value={inputSearchModalStatistics}
                                    onChange={searchStatistics}
                                    createNewStatistic={createNewStatistic}
                                    setOpenModalStatisticSave={
                                      setOpenModalStatisticSave
                                    }
                                    filterArraySearchModalStatistics={
                                      filterArraySearchModalStatistics
                                    }
                                    handleChecboxChangeStatistics={
                                      handleChecboxChangeStatistics
                                    }
                                    statisticsChecked={statisticsChecked}
                                    disabledStatisticsChecked={
                                      disabledStatisticsChecked
                                    }
                                    statistics={statistics}
                                    openStatisticWarning={openStatisticWarning}
                                  ></ModalSelectedStatistic>
                                )}
                              </>
                            )}
                          </>
                        )}

                        {openModalStatisticSave && (
                          <ModalWindow
                            text={
                              "При приклеплении статистики к этому посту она отвяжется у предыдущего."
                            }
                            close={setOpenModalStatisticSave}
                            btnYes={btnYes}
                            btnNo={btnNoSave}
                          ></ModalWindow>
                        )}

                        {openModalStatisticWarning && (
                          <ModalWindow
                            text={
                              "У Вас имеются не сохранненые данные, нажмите на Да и даннные сохранятся."
                            }
                            close={setOpenModalStatisticWarning}
                            btnYes={btnYes}
                            btnNo={btnNo}
                          ></ModalWindow>
                        )}

                        <HandlerMutation
                          Loading={isLoadingUpdatePostMutation}
                          Error={isErrorUpdatePostMutation && !manualErrorReset} 
                          Success={
                            isSuccessUpdatePostMutation && !manualSuccessReset
                          } 
                          textSuccess={"Пост обновлен"}
                          textError={
                            ErrorUpdatePostMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdatePostMutation.data.errors[0].errors[0]
                              : ErrorUpdatePostMutation?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingStatisticsToPostIdMutation}
                          Error={
                            isErrorUpdateStatisticsToPostIdMutation &&
                            !manualErrorResetStatistic
                          } 
                          Success={
                            isSuccessUpdateStatisticsToPostIdMutation &&
                            !manualSuccessResetStatistic
                          } 
                          textSuccess={"Статистика для поста обновлена"}
                          textError={
                            ErrorUpdateStatisticsToPostIdMutation?.data
                              ?.errors?.[0]?.errors?.[0]
                              ? ErrorUpdateStatisticsToPostIdMutation.data
                                  .errors[0].errors[0]
                              : ErrorUpdateStatisticsToPostIdMutation?.data
                                  ?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters letters={"Выберите пост"}></WaveLetters>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
