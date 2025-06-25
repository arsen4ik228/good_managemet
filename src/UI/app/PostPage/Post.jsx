import React, { useState, useEffect, useRef } from "react";
import classes from "./Post.module.css";
import greyPolicy from "@image/greyPolicy.svg";
import blackStatistic from "@image/blackStatistic.svg";
import { useNavigate, useParams } from "react-router-dom";
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
import { usePostsHook } from "@hooks";
import { useStatisticsHook } from "../../../hooks/useStatisticsHook";
import RoleContainer from "./RoleContainer";
import avatar from '@Custom/icon/icon _ GM.svg'
import { baseUrl } from "@helpers/constants.js"; // Импорт базового URL

import { ConfigProvider, Tour, Select as SelectAnt, Input as InputAnt, Tooltip, Avatar } from "antd";
import ruRU from "antd/locale/ru_RU";
import { values } from "lodash";


const { Option } = Select;


export default function Post() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const newPost = () => {
    navigate(`/pomoshnik/postNew`);
  };

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);

  const createdId = useSelector((state) => state.post.postCreatedId);

  const [postName, setPostName] = useState(null);
  const [divisionName, setDivisionName] = useState(null);
  const [disabledDivisionName, setDisabledDivisionName] = useState(false);
  const [parentPostId, setParentPostId] = useState("");
  const [worker, setWorker] = useState(null);
  const [userRole, setUserRole] = useState();

  const [product, setProduct] = useState(null);
  const [isProductChanges, setIsProductChanges] = useState(false);

  const [purpose, setPurpose] = useState(null);
  const [isPurposeChanges, setIsPurposeChanges] = useState(false);

  const [selectParentPost, setSelectParentPost] = useState();

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

  const refPostName = useRef(null);
  const refLupa = useRef(null);
  const refDivisionName = useRef(null);
  const refParentPostId = useRef(null);
  const refWorker = useRef(null);
  const refCreate = useRef(null);
  const refUpdate = useRef(null);

  const [open, setOpen] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const steps = [
    {
      title: "Название поста",
      description: "Здесь можно поменять название выбранного поста",
      target: () => refPostName.current, // Добавляем проверку
    },
    {
      title: "Выбрать пост",
      description: "Нажмите и выберите пост",
      target: () => refLupa.current, // Добавляем проверку
    },
    {
      title: "Название подразделения",
      description: "Здесь можно поменять название подразделения",
      target: () => (selectedPostId ? refDivisionName.current : null), // Добавляем проверку
      disabled: !selectedPostId,
    },
    {
      title: "Руководитель",
      description: "Нажмите и поменяйте руководителя",
      target: () => (selectedPostId ? refParentPostId.current : null), // Добавляем проверку
      disabled: !selectedPostId,
    },
    {
      title: "Сотрудники",
      description: "Нажмите и поменяйте сотрудника",
      target: () => (selectedPostId ? refWorker.current : null), // Добавляем проверку
      disabled: !selectedPostId,
    },

    {
      title: "Создать",
      description: "Нажмите для создания поста",
      target: () => refCreate.current,
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
  ].filter((step) => !step.disabled);

  const {
    allPosts,
    isLoadingGetPosts,
    isErrorGetPosts,

    currentPost,
    workers,
    posts,
    parentPost,
    policiesActive,
    statisticsIncludedPost,
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
    selectedPolicyIDInPost,
    selectedPolicyNameInPost,
    refetchPostIdQuery,

    roles,

    updatePost,
    isLoadingUpdatePostMutation,
    isSuccessUpdatePostMutation,
    isErrorUpdatePostMutation,
    ErrorUpdatePostMutation,
    localIsResponseUpdatePostMutation,
  } = usePostsHook({ postId: selectedPostId });

  const {
    postStatistics,
    isLoadingPostStatisticMutation,
    isSuccessPostStatisticMutation,
    isErrorPostStatisticMutation,
    ErrorPostStatisticMutation,
    localIsResponsePostStatisticsMutation,

    updateStatisticsToPostId,
    isLoadingStatisticsToPostIdMutation,
    isSuccessUpdateStatisticsToPostIdMutation,
    isErrorUpdateStatisticsToPostIdMutation,
    ErrorUpdateStatisticsToPostIdMutation,
    localIsResponseUpdateStatisticsToPostIdMutation,
  } = useStatisticsHook();

  const methodForLupa = (parametr) => {
    setIsOpenSearch(parametr);
  };

  useEffect(() => {
    if (createdId || postId) {
      setSelectedPostId(createdId || postId);
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
      setDivisionName(obj?.divisionName || null);
      setDisabledDivisionName(true);
    } else {
      setDivisionName(currentPost?.divisionName || null);
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
      setWorker(null);
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
    if (currentPost?.role != null) {
      setUserRole(currentPost?.role?.id);
    }
  }, [currentPost.id]);

  const saveUpdatePost = async () => {
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
      updatedData.responsibleUserId = worker === null ? null : worker;
    }

    if (selectedPolicyID !== selectedPolicyIDInPost) {
      updatedData.policyId =
        selectedPolicyID === null ? null : selectedPolicyID;
    }
    if (currentPost.roleId !== userRole) {
      updatedData.roleId = userRole
    }
    console.log(JSON.stringify(updatedData));
    // Проверяем, если есть данные для обновления
    if (Object.keys(updatedData).length > 0) {
      await updatePost({
        _id: selectedPostId,
        ...updatedData, // отправляем только измененные поля
      })
        .unwrap()
        .then(() => { })
        .catch((error) => {
          console.error("Ошибка:", JSON.stringify(error, null, 2));
        });
    } else {
      console.log("Нет изменений для обновления");
    }
  };

  const selectPost = (id) => {
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
  } = useModalSelectRadio({ array: policiesActive, arrayItem: "policyName" });

  useEffect(() => {
    const ids = statisticsIncludedPost.map((item) => item.id);
    setStatisticsChecked(ids);
    setDisabledStatisticsChecked(ids);
  }, [isFetchingGetPostId]);

  // Статистика
  const {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
    inputSearchModalStatistics,
    filterArraySearchModalStatistics,

    handleChecboxChangeStatistics,
    searchStatistics,
    resetStatisticsId,
  } = useModalCheckBoxStatistic({ openModalStatistic, setStatisticsChecked });

  const saveStatisticsId = async () => {
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
        })
        .catch((error) => {
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
  const createNewStatistic = async () => {
    await postStatistics({
      name: "Статистика",
      postId: selectedPostId,
    })
      .unwrap()
      .then(() => { })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };


  const handleSearch = (value) => {
    setInputValue(value);
  };

  const handleBlur = () => {
    if (inputValue && !allPosts.some(post => post.postName === inputValue)) {
      // Если введено новое значение, которого нет в options
      setPostName(inputValue);
      setSelectedValue(inputValue);
    }
  };

  return (
    <div className={classes.dialog}>
      <Headers name={"посты"} funcActiveHint={() => setOpen(true)}>
        <BottomHeaders
          create={newPost}
          update={saveUpdatePost}
          refCreate={refCreate}
          refUpdate={refUpdate}
        >
          <div className={classes.rowContainer}>
            {/* Название поста */}
            <div className={classes.item} ref={refPostName}>
              <div className={classes.itemName}>
                <span>Название поста</span>
              </div>
              <SelectAnt
                className={classes.selectAnt}
                loading={isLoadingGetPosts}
                showSearch
                onSearch={handleSearch}
                onBlur={handleBlur}
                placeholder="Выберите пост"
                optionFilterProp="label"
                value={selectedValue || postName}
                onChange={(option) => {
                  setPostName(option);
                  selectPost(option);
                  setInputValue(undefined)
                  setSelectedValue(option)
                }}
                options={allPosts.map((post) => ({
                  label: post.postName,
                  value: post.id,
                }))}
              />
            </div>

            {currentPost.id && (
              <>
                <div className={classes.item} ref={refDivisionName}>
                  <div className={classes.itemName}>
                    <span>Название подразделения</span>
                  </div>
                  <Tooltip
                    title={divisionName}
                    placement="topLeft"
                    mouseEnterDelay={0.5}
                    className={classes.tooltipOverlay}
                    trigger={['hover', 'focus']}
                  >
                    <InputAnt
                      className={classes.inputAnt}
                      value={divisionName}
                      onChange={(e) => setDivisionName(e.target.value)}
                      disabled={disabledDivisionName}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    />
                  </Tooltip>
                </div>
                <div className={classes.item} ref={refParentPostId}>
                  <div className={classes.itemName}>
                    <span>
                      Руководитель
                    </span>
                  </div>
                  <SelectAnt
                    style={{ width: '100%' }}
                    value={parentPostId || undefined} // Antd Select не принимает пустую строку
                    onChange={setParentPostId}
                    placeholder="Выберите руководителя"
                    optionFilterProp="label"
                    options={[{ label: '-', value: null }, ...posts.map((post) => ({
                      label: post.postName,
                      value: post.id,
                    })).sort((a, b) => a.label.localeCompare(b.label))]}
                  >
                  </SelectAnt>
                </div>
                <div className={classes.item} ref={refWorker}>
                  <div className={classes.itemName}>
                    <span>
                      Сотрудник
                    </span>
                  </div>
                  <SelectAnt
                    ref={refWorker}
                    style={{ width: '100%' }}
                    value={worker}
                    onChange={setWorker}
                    placeholder="Выберите сотрудника"
                    showSearch
                    optionFilterProp="label"
                    dropdownStyle={{
                      minWidth: '300px' // Или минимальная ширина
                    }}
                    optionRender={(option) => (
                      <div className={classes.optionItem}>
                        <Avatar
                          src={option.data.avatar_url ? `${baseUrl}${option.data.avatar_url}` : avatar}
                          size="small"
                          className={classes.avatar}
                          alt='avatar'
                        >
                          {option.data.avatar_url}
                        </Avatar>
                        <span>{option.label}</span>
                      </div>
                    )}
                    options={workers.map((worker) => ({
                      label: `${worker.lastName} ${worker.firstName}`,
                      value: worker.id,
                      avatar_url: worker.avatar_url
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label))
                  }
                  >
                  </SelectAnt>
                </div>
              </>
            )}
          </div>

        </BottomHeaders>
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </ConfigProvider>

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
                          <div className={classes.backgroundBorder}>
                            <div className={classes.productHeader}>
                              Продукт поста
                            </div>
                          </div>
                          <textarea
                            className={classes.Teaxtaera}
                            placeholder="Описание продукта поста"
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
                          <div className={classes.backgroundBorder}>
                            <div className={classes.destinyHeader}>
                              Предназначение поста
                            </div>
                          </div>

                          <textarea
                            className={classes.Teaxtaera}
                            placeholder="Описание предназначения поста"
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

                        <Tooltip
                          title={selectedPolicyName || "Прикрепить политику"}
                          placement="topLeft"
                          mouseEnterDelay={0.3}
                          overlayClassName={classes.customTooltip}
                        >
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
                        </Tooltip>

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

                        <RoleContainer
                          rolesArray={roles}
                          role={userRole}
                          setRole={setUserRole}
                        ></RoleContainer>

                        {openModalPolicy && (
                          <ModalSelectRadio
                            nameTable={"Выбор политики"}
                            handleSearchValue={inputSearchModal}
                            handleSearchOnChange={handleInputChangeModalSearch}
                            handleRadioChange={handleRadioChange}
                            exit={() => {
                              setOpenModalPolicy(false);
                            }}
                            filterArray={filterArraySearchModal}
                            array={policiesActive}
                            arrayItem={"policyName"}
                            selectedItemID={selectedPolicyID}
                          ></ModalSelectRadio>
                        )}

                        {isErrorGetStatistics ? (
                          <HandlerQeury
                            Error={isErrorGetStatistics}
                          ></HandlerQeury>
                        ) : (
                          <>
                            <HandlerQeury
                              Loading={isLoadingGetStatistics}
                            ></HandlerQeury>
                            {!isErrorGetStatistics && (
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
                          Error={
                            isErrorUpdatePostMutation &&
                            localIsResponseUpdatePostMutation
                          }
                          Success={
                            isSuccessUpdatePostMutation &&
                            localIsResponseUpdatePostMutation
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
                            localIsResponseUpdateStatisticsToPostIdMutation
                          }
                          Success={
                            isSuccessUpdateStatisticsToPostIdMutation &&
                            localIsResponseUpdateStatisticsToPostIdMutation
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

                        <HandlerMutation
                          Loading={isLoadingPostStatisticMutation}
                          Error={
                            isErrorPostStatisticMutation &&
                            localIsResponsePostStatisticsMutation
                          }
                          Success={
                            isSuccessPostStatisticMutation &&
                            localIsResponsePostStatisticsMutation
                          }
                          textSuccess={"Статистика для поста создана"}
                          textError={
                            ErrorPostStatisticMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPostStatisticMutation.data.errors[0]
                                .errors[0]
                              : ErrorPostStatisticMutation?.data?.message
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
