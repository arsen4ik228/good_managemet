import React, { useState, useEffect } from "react";
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
import { usePostsHook } from "../../../../hooks/usePostsHook";
import ButtonAttach from "../../Custom/buttonAttach/ButtonAttach";

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
  const [worker, setWorker] = useState(createdUserId);

  const [product, setProduct] = useState("");
  const [purpose, setPurpose] = useState("");

  const [openModalPolicy, setOpenModalPolicy] = useState(false);
  const [openModalStatistic, setOpenModalStatistic] = useState(false);

  const {
    reduxSelectedOrganizationId,

    staff,
    policies,
    parentPosts,
    maxDivisionNumber,
    isLoadingGetNew,
    isErrorGetNew,

    postPosts,
    isLoadingPostMutation,
    isSuccessPostMutation,
    isErrorPostMutation,
    ErrorPostMutation,
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

  return (
    <div className={classes.dialog}>
      <Headers name={"создание поста"} back={back}>
        <BottomHeaders update={savePosts}>
          <Input
            name={"Название поста"}
            value={postName}
            onChange={setPostName}
          ></Input>
          <Input
            name={"Название подразделения"}
            value={divisionName}
            onChange={setDivisionName}
          ></Input>
          <Select
            name={"Руководитель"}
            value={parentId}
            onChange={setParentId}
            array={parentPosts}
            arrayItem={"postName"}
          >
            <option value="null"> — </option>
          </Select>
          <Select
            name={"Сотрудник"}
            value={worker}
            onChange={setWorker}
            array={staff}
            arrayItem={"lastName"}
            arrayItemTwo={"firstName"}
          >
            <option value="null"> — </option>
          </Select>
        </BottomHeaders>
      </Headers>

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
                  Error={isErrorPostMutation}
                  Success={isSuccessPostMutation}
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
