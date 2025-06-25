import React, { useState, useEffect, useRef } from "react";
import classes from "./PostNew.module.css";

import greyPolicy from "@image/greyPolicy.svg";
import blackStatistic from "@image/blackStatistic.svg";

import { useNavigate } from "react-router-dom";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setPostCreatedId } from "@slices";
import ModalWindow from "@Custom/ModalWindow.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import Input from "@Custom/Input/Input";
import Select from "@Custom/Select/Select";
import { ModalSelectRadio } from "@Custom/modalSelectRadio/ModalSelectRadio";
import { useModalSelectRadio } from "@hooks/useModalSelectRadio";
import { usePostsHook } from "@hooks";
import ButtonAttach from "@Custom/buttonAttach/ButtonAttach";
import RoleContainer from "./RoleContainer";
import avatar from '@Custom/icon/icon _ GM.svg'
import { baseUrl } from "@helpers/constants.js"; // Импорт базового URL

import { ConfigProvider, Tour, Select as SelectAnt, Input as InputAnt, Tooltip, Avatar } from "antd";
import ruRU from "antd/locale/ru_RU";

export default function PostNew() {
  const navigate = useNavigate();
  const back = () => {
    navigate(`/pomoshnik/post`);
  };
  const dispatch = useDispatch();
  const createdUserId = useSelector((state) => state.user.createdUserId);

  const [postName, setPostName] = useState("");
  const [divisionName, setDivisionName] = useState(null);
  const [divisionNameDB, setDivisionNameDB] = useState();

  const [parentId, setParentId] = useState("null");
  const [worker, setWorker] = useState(createdUserId || "null");

  const [product, setProduct] = useState("");
  const [purpose, setPurpose] = useState("");

  const [openModalPolicy, setOpenModalPolicy] = useState(false);
  const [openModalStatistic, setOpenModalStatistic] = useState(false);

  const [userRole, setUserRole] = useState();

  const refPostName = useRef(null);
  const refDivisionName = useRef(null);
  const refParentPostId = useRef(null);
  const refWorker = useRef(null);
  const refUpdate = useRef(null);

  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Название поста",
      description: "Укажите название поста",
      target: () => refPostName.current, // Добавляем проверку
    },

    {
      title: "Название подразделения",
      description: "Укажите название подразделения",
      target: () => refDivisionName.current, // Добавляем проверку
    },
    {
      title: "Руководитель",
      description: "Нажмите и назначьте руководителя",
      target: () => refParentPostId.current, // Добавляем проверку
    },
    {
      title: "Сотрудники",
      description: "Нажмите и назначьте сотрудника",
      target: () => refWorker.current, // Добавляем проверку
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
  ];

  const {
    reduxSelectedOrganizationId,

    staff,
    policies,
    parentPosts,
    roles,
    maxDivisionNumber,
    isLoadingGetNew,
    isErrorGetNew,

    postPosts,
    isLoadingPostMutation,
    isSuccessPostMutation,
    isErrorPostMutation,
    ErrorPostMutation,
    localIsResponsePostPostMutation,
  } = usePostsHook();

  const successCreatePost = (id) => {
    dispatch(setPostCreatedId(id));
    navigate(`/pomoshnik/post`);
  };

  const savePosts = async () => {
    const Data = {};
    if (selectedPolicyID !== "null" && selectedPolicyID !== null) {
      Data.policyId = selectedPolicyID;
    }
    if (divisionName !== divisionNameDB) {
      Data.divisionName = divisionName;
    } else {
      Data.divisionName = divisionName;
    }
    if (parentId !== "null") {
      Data.parentId = parentId;
    }

    if (worker !== "null") {
      Data.responsibleUserId = worker;
    }

    if (userRole) {
      Data.roleId = userRole;
    } else Data.roleId = roles.find((item) => item.roleName === "Сотрудник").id;

    await postPosts({
      postName: postName,
      ...Data,
      product: product,
      purpose: purpose,
      organizationId: reduxSelectedOrganizationId,
    })
      .unwrap()
      .then((result) => {
        setTimeout(() => {
          successCreatePost(result?.id);
        }, 2000);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const {
    selectedID: selectedPolicyID,
    selectedName: selectedPolicyName,

    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,
  } = useModalSelectRadio({ array: policies, arrayItem: "policyName" });

  useEffect(() => {
    setDivisionName(`Подразделение №${maxDivisionNumber}`);
    setDivisionNameDB(`Подразделение №${maxDivisionNumber}`);
  }, [maxDivisionNumber]);

  console.log(`worker = ${userRole}`);


  const parentPostsWithDefault = [{ label: '-', value: null }, ...parentPosts.map((post) => ({
    label: post.postName,
    value: post.id,
  })).sort((a, b) => a.label.localeCompare(b.label))]
  console.log(parentPostsWithDefault[1]?.value)

  return (
    <div className={classes.dialog}>
      <Headers
        name={"создание поста"}
        back={back}
        funcActiveHint={() => setOpen(true)}
      >
        <BottomHeaders update={savePosts} refUpdate={refUpdate}>


          <div className={classes.item} ref={refPostName}>
            <div className={classes.itemName}>
              <span>
                Название поста <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <Tooltip
              title={postName}
              placement="topLeft"
              mouseEnterDelay={0.5}
              className={classes.tooltipOverlay}
              trigger={['hover', 'focus']}
            >
              <InputAnt
                className={classes.inputAnt}
                value={postName}
                onChange={(e) => setPostName(e.target.value)}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              />
            </Tooltip>
          </div>

          <div className={classes.item} ref={refDivisionName}>
            <div className={classes.itemName}>
              <span>
                Название подразделения <span style={{ color: "red" }}>*</span>
              </span>
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
                Руководитель <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <SelectAnt
              style={{ width: '100%' }}
              onChange={setParentId}
              placeholder="Выберите руководителя"
              optionFilterProp="label"
              options={parentPostsWithDefault}
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
              options={staff.map((worker) => ({
                label: `${worker.lastName} ${worker.firstName}`,
                value: worker.id,
                avatar_url: worker.avatar_url
              })).sort((a, b) => a.label.localeCompare(b.label))}
            >
            </SelectAnt>
          </div>
        </BottomHeaders>
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </ConfigProvider>

      <div className={classes.main}>
        {isErrorGetNew ? (
          <HandlerQeury Error={isErrorGetNew}></HandlerQeury>
        ) : (
          <>
            {isLoadingGetNew ? (
              <HandlerQeury Loading={isLoadingGetNew}></HandlerQeury>
            ) : (
              <>
                <div className={classes.productTeaxtaera}>
                  <div className={classes.backgroundBorder}>
                    <div className={classes.productHeader}>
                      Продукт поста *
                    </div>
                  </div>
                  <textarea
                    className={classes.Teaxtaera}
                    placeholder="описание продукта поста"
                    value={product}
                    onChange={(e) => {
                      setProduct(e.target.value);
                    }}
                  />
                </div>

                <div className={classes.destinyTeaxtaera}>
                  <div className={classes.backgroundBorder}>
                    <div className={classes.destinyHeader}>
                      Предназначение поста *
                    </div>
                  </div>
                  <textarea
                    className={classes.Teaxtaera}
                    placeholder="описнаие предназначения поста"
                    value={purpose}
                    onChange={(e) => {
                      setPurpose(e.target.value);
                    }}
                  />
                </div>

                <ButtonAttach
                  image={greyPolicy}
                  onClick={() => setOpenModalPolicy(true)}
                  selectArray={selectedPolicyName}
                  prefix={"Политика:"}
                  btnName={"Прикрепить политику"}
                ></ButtonAttach>

                <ButtonAttach
                  image={blackStatistic}
                  onClick={() => setOpenModalStatistic(true)}
                  btnName={" Выбрать или создать статистику для поста"}
                ></ButtonAttach>

                <RoleContainer
                  rolesArray={roles}
                  role={userRole}
                  setRole={setUserRole}
                ></RoleContainer>

                {openModalStatistic && (
                  <ModalWindow
                    text={
                      "Выбрать или создать статистику для поста, можно после создания поста."
                    }
                    close={setOpenModalStatistic}
                    exitBtn={true}
                  ></ModalWindow>
                )}

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

                <HandlerMutation
                  Loading={isLoadingPostMutation}
                  Error={isErrorPostMutation && localIsResponsePostPostMutation}
                  Success={
                    isSuccessPostMutation && localIsResponsePostPostMutation
                  }
                  textSuccess={`Пост ${postName} успешно создан.`}
                  textError={
                    ErrorPostMutation?.data?.errors?.[0]?.errors?.[0]
                      ? ErrorPostMutation.data.errors[0].errors[0]
                      : ErrorPostMutation?.data?.message
                  }
                ></HandlerMutation>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
