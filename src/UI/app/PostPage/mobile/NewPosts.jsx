import React, { useState, useEffect } from "react";
import classes from "./NewPosts.module.css";
import attachpolicy from "./icon/icon _ attach policy.svg";
import { useNavigate } from "react-router-dom";
import HandlerMutation from "@Custom/mobileHandler/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import Header from "@Custom/CustomHeader/Header";
import blackStatistic from "@Custom/icon/blackStatistic.svg";
import AttachPolicy from "@Custom/AttachPolicy/AttachPolicy.jsx";
import AlertSavePost from "@Custom/AlertSavePost/AlertSavePost.jsx";
import { ButtonContainer } from "@Custom/CustomButtomContainer/ButtonContainer.jsx";
import { usePostsHook, useGetReduxOrganization } from "@hooks";
import { useSelector } from "react-redux";

const Posts = () => {
  const navigate = useNavigate();

  const { reduxSelectedOrganizationId } = useGetReduxOrganization();
  const createdUserId = useSelector((state) => state.user.createdUserId);

  const [postName, setPostName] = useState();
  const [divisionName, setDivisionName] = useState("");
  const [product, setProduct] = useState();
  const [purpose, setPurpose] = useState();
  const [policy, setPolicy] = useState(null);
  const [worker, setWorker] = useState(createdUserId);
  const [parentId, setParentId] = useState("");
  const [currentPolicyName, setCurrentPolicyName] = useState(null);

  const [modalPolicyOpen, setModalPolicyOpen] = useState(false);
  const [modalStatisticsOpen, setModalStatisticsOpen] = useState(false);

  const {
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
    localIsResponsePostPostMutation,
  } = usePostsHook();

  useEffect(() => {
    if (divisionName === "" && maxDivisionNumber)
      setDivisionName(`Подразделение №${maxDivisionNumber}`);
  }, [maxDivisionNumber]);

  useEffect(() => {
    const foundPolicy = policies?.find((item) => item.id === policy);
    setCurrentPolicyName(foundPolicy ? foundPolicy?.policyName : null);
  }, [policy]);

  const savePosts = async () => {
    const Data = {};
    if (parentId) {
      Data.parentId = parentId;
    }
    if (worker) {
      Data.responsibleUserId = worker;
    }
    if (policy !== null) {
      Data.addPolicyId = policy;
    }
    await postPosts({
      postName: postName,
      divisionName: divisionName,
      product: product,
      purpose: purpose,
      organizationId: reduxSelectedOrganizationId,
      ...Data,
    })
      .unwrap()
      .then((result) => {
        setTimeout(() => {
          navigate(`/pomoshnik/Post/${result?.id}`);
        }, 2000);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header title={"Создание нового поста"}>Личный помощник</Header>
        </>

        <div className={classes.body}>
          <>
            <div className={classes.bodyContainer}>
              <input
                className={classes.first}
                type={"text"}
                value={postName}
                onChange={(e) => {
                  setPostName(e.target.value);
                }}
              />
            </div>

            <div className={classes.bodyContainer}>
              {/* Подразделение divisionName */}
              <div className={classes.name}>Подразделение</div>
              <div className={classes.selectSection}>
                <input
                  type="text"
                  value={divisionName}
                  onChange={(e) => {
                    setDivisionName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className={classes.bodyContainer}>
              <div className={classes.name}>Руководитель</div>
              <div className={classes.selectSection}>
                <select
                  name="mySelect"
                  className={classes.select}
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);
                  }}
                >
                  <option value="">Выберите опцию</option>
                  {parentPosts?.map((item) => {
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
              {/* СОТРУДНИК staff */}
              <div className={classes.name}>Сотрудник</div>
              <div className={classes.selectSection}>
                <select
                  name="mySelect"
                  className={classes.select}
                  value={worker}
                  onChange={(e) => {
                    setWorker(e.target.value);
                  }}
                >
                  <option value="">Выберите опцию</option>
                  {staff?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {`${item.firstName} ${item.lastName}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </>
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
                        placeholder="Описание продукта поста"
                        value={product}
                        onChange={(e) => {
                          setProduct(e.target.value);
                        }}
                      />
                    </div>

                    <div className={classes.destinyTeaxtaera}>
                      <textarea
                        className={classes.Teaxtaera}
                        placeholder="Описнаие предназначения поста"
                        value={purpose}
                        onChange={(e) => {
                          setPurpose(e.target.value);
                        }}
                      />
                    </div>

                    <div
                      className={classes.post}
                      onClick={() => setModalPolicyOpen(true)}
                    >
                      <img src={attachpolicy} alt="blackStatistic" />
                      <div>
                        {policy ? (
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
                      onClick={() => setModalStatisticsOpen(true)}
                    >
                      <img src={blackStatistic} alt="blackStatistic" />
                      <div>
                        <span className={classes.nameButton}>
                          Выбрать или создать статистику для поста
                        </span>
                      </div>
                    </div>
                    <HandlerMutation
                      Loading={isLoadingPostMutation}
                      Error={
                        isErrorPostMutation && localIsResponsePostPostMutation
                      }
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

        <ButtonContainer clickFunction={savePosts}>СОХРАНИТЬ</ButtonContainer>
      </div>
      {modalPolicyOpen && (
        <AttachPolicy
          setModalOpen={setModalPolicyOpen}
          title={"Политики"}
          firstArray={policies}
          componentName={"policyName"}
          id={policy}
          setIds={setPolicy}
        ></AttachPolicy>
      )}
      {modalStatisticsOpen && (
        <AlertSavePost
          requestFunc={savePosts}
          setModalOpen={setModalStatisticsOpen}
        ></AlertSavePost>
      )}
    </>
  );
};

export default Posts;
