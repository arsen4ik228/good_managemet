import React, { useState, useEffect } from "react";
import classes from "./PostNew.module.css";

import greyPolicy from "@image/greyPolicy.svg";
import blackStatistic from "@image/blackStatistic.svg";

import { useNavigate } from "react-router-dom";
import { useGetPostNewQuery, usePostPostsMutation } from "@services";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";

import { useDispatch } from "react-redux";
import { setPostCreatedId } from "@slices";
import ModalWindow from "@Custom/ModalWindow.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import Input from "@Custom/Input/Input";
import Select from "@Custom/Select/Select";
import { ModalSelectRadio } from "@Custom/modalSelectRadio/ModalSelectRadio";
import {useModalSelectRadio} from "@hooks/useModalSelectRadio";
import useGetOldAndNewOrganizationId from "@hooks/useGetReduxOrganization";


export default function PostNew() {
  const navigate = useNavigate();
  const back = () => {
    navigate(`/pomoshnik/post`);
  };
  const dispatch = useDispatch();

  const [postName, setPostName] = useState("");
  const [divisionName, setDivisionName] = useState(null);
  const [divisionNameDB, setDivisionNameDB] = useState();

  const [parentId, setParentId] = useState("null");
  const [worker, setWorker] = useState("null");

  const [product, setProduct] = useState("");
  const [purpose, setPurpose] = useState("");

  const [openModalPolicy, setOpenModalPolicy] = useState(false);
  const [openModalStatistic, setOpenModalStatistic] = useState(false);

   const {reduxNewSelectedOrganizationId } =
      useGetOldAndNewOrganizationId();

  const {
    workers = [],
    policies = [],
    posts = [],
    maxDivisionNumber,
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetPostNewQuery({organizationId:reduxNewSelectedOrganizationId}, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      policies: data?.policies || [],
      posts: data?.posts || [],
      maxDivisionNumber: data?.maxDivisionNumber,
      isLoadingGetNew: isLoading,
      isErrorGetNew: isError,
    }),
  });

  const [
    postPosts,
    {
      isLoading: isLoadingPostMutation,
      isSuccess: isSuccessPostMutation,
      isError: isErrorPostMutation,
      error: Error,
    },
  ] = usePostPostsMutation();

  const successCreatePost = (id) => {
    dispatch(setPostCreatedId(id));
    navigate(`/pomoshnik/post`);
  };

  const savePosts = async () => {
    const Data = {};
    if (selectedPolicyID !== "null" && selectedPolicyID !== null) {
      Data.addPolicyId = selectedPolicyID;
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
      organizationId:reduxNewSelectedOrganizationId,
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
    selectedName:selectedPolicyName,

    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,
  } = useModalSelectRadio({ array: policies, arrayItem: "policyName" });

  useEffect(() => {
    setDivisionName(`Подразделение №${maxDivisionNumber + 1}`);
    setDivisionNameDB(`Подразделение №${maxDivisionNumber + 1}`);
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
            array={posts}
            arrayItem={"postName"}
          >
            <option value="null"> — </option>
          </Select>
          <Select
            name={"Сотрудник"}
            value={worker}
            onChange={setWorker}
            array={workers}
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

                <div
                  className={classes.post}
                  onClick={() => setOpenModalPolicy(true)}
                >
                  <img src={greyPolicy} alt="greyPolicy" />
                  <div>
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
                  <div>
                    <span className={classes.nameButton}>
                      Выбрать или создать статистику для поста
                    </span>
                  </div>
                </div>

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
                    exit={() => {setOpenModalPolicy(false)}}
                    filterArray={filterArraySearchModal}
                    array={policies}
                    arrayItem={"policyName"}
                    selectedID={selectedPolicyID}
                  ></ModalSelectRadio>
                )}

                <HandlerMutation
                  Loading={isLoadingPostMutation}
                  Error={isErrorPostMutation}
                  Success={isSuccessPostMutation}
                  textSuccess={"Пост успешно создан."}
                  textError={
                    Error?.data?.errors?.[0]?.errors?.[0]
                      ? Error.data.errors[0].errors[0]
                      : Error?.data?.message
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
