import React, { useState, useEffect, useRef } from "react";
import classes from "./Policy.module.css";
import subbarSearch from "@image/subbarSearch.svg";
import folder from "@image/folder.svg";
import iconSublist from "@image/iconSublist.svg";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import HandlerQeury from "@Custom/HandlerQeury.jsx";
import addCircleBlue from "@image/addCircleBlue.svg";
import WaveLetters from "@Custom/WaveLetters.jsx";
import Mdxeditor from "@Custom/Mdxeditor/Mdxeditor.jsx";
import Headers from "@Custom/Headers/Headers.jsx";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders.jsx";
import Select from "@Custom/Select/Select.jsx";
import ModalFolder from "@Custom/modalFolder/ModalFolder";
import ModalWindow from "@Custom/ModalWindow";
import { usePolicyHook, useGetReduxOrganization } from "@hooks";
import { useDirectories } from "./hooks/Directories";
import { useParams } from "react-router-dom";

export default function Policy() {
  const {policyId} = useParams();

  useEffect(() => {
    if(policyId){
      setSelectedPolicyId(policyId);
    }
  }, []);

  const selectRef = useRef(null);

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [editorState, setEditorState] = useState("");
  const [disabledArchive, setDisabledArchive] = useState(false);

  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    //useGetPoliciesQuery
    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,

    //Valera
    instructionsActive,
    instructionsDraft,
    instructionsCompleted,

    directivesActive,
    directivesDraft,
    directivesCompleted,

    //useGetPoliciesIdQuery
    currentPolicy,
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,

    postPolicy,
    isLoadingPostPoliciesMutation,
    isSuccessPostPoliciesMutation,
    isErrorPostPoliciesMutation,
    ErrorPostPoliciesMutation,
    localIsResponsePostPoliciesMutation,

    updatePolicy,
    isLoadingUpdatePoliciesMutation,
    isSuccessUpdatePoliciesMutation,
    isErrorUpdatePoliciesMutation,
    ErrorUpdatePoliciesMutation,
    localIsResponseUpdatePoliciesMutation,
  } = usePolicyHook({
    policyId: selectedPolicyId,
    organizationId: reduxSelectedOrganizationId,
  });

  const {
    setCurrentDirectoryInstructions,
    setCurrentDirectoryDirectives,

    directoriesSendBD,
    currentDirectoryName,
    setCurrentDirectoryName,

    directoryName,
    setDirectoryName,

    currentDirectoryInstructions,
    currentDirectoryDirectives,

    inputSearchModalDirectory,
    filterArraySearchModalDirectives,
    filterArraySearchModalInstructions,

    //Получение папок
    foldersSort,
    isLoadingGetPolicyDirectories,
    isErrorGetPolicyDirectories,
    isFetchingGetPolicyDirectories,

    //Создание папки
    openModalCreateDirectory,

    openCreateDirectory,
    exitCreateDirectory,

    saveFolder,

    isLoadingPostPoliciesDirectoriesMutation,
    isSuccessPostPoliciesDirectoriesMutation,
    isErrorPostPoliciesDirectoriesMutation,
    ErrorPostPoliciesDirectoriesMutation,
    localIsResponsePostPolicyDirectoriesMutation,

    //Обновление папки
    openModalUpdateDirectory,

    updateDirectory,
    exitUpdateDirectory,

    saveUpdateFolder,

    isLoadingUpdatePolicyDirectoriesMutation,
    isSuccessUpdatePolicyDirectoriesMutation,
    isErrorUpdatePolicyDirectoriesMutation,
    ErrorUpdateDirectories,
    localIsResponseUpdatePolicyDirectoriesMutation,

    //Удаление папки
    openModalDeleteDirectory,
    setOpenModalDeleteDirectory,

    saveDeleteFolder,

    isLoadingDeletePolicyDirectoriesMutation,
    isSuccessDeletePolicyDirectoriesMutation,
    isErrorDeletePolicyDirectoriesMutation,
    ErrorDeleteDirectories,
    localIsResponseDeletePolicyDirectoriesMutation,

    handleInputChangeModalSearch,
    handleCheckboxChange,
    handleCheckboxChangeUpdate,
  } = useDirectories({ instructionsActive, directivesActive });

  const savePostPolicy = async () => {
    await postPolicy({
      organizationId: reduxSelectedOrganizationId,
    })
      .unwrap()
      .then((result) => {
        setSelectedPolicyId(result.id);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const saveUpdatePolicy = async () => {
    const Data = {};

    if (policyName !== null && currentPolicy.policyName !== policyName) {
      Data.policyName = policyName;
    }
    if (state !== null && currentPolicy.state !== state) {
      Data.state = state;
    }
    if (type !== null && currentPolicy.type !== type) {
      Data.type = type;
    }
    if (editorState !== null && currentPolicy.content !== editorState) {
      Data.content = editorState;
    }
    await updatePolicy({
      _id: selectedPolicyId,
      ...Data,
    })
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const getPolicyId = (id) => {
    setSelectedPolicyId(id);
  };

  useEffect(() => {
    if (currentPolicy.policyName) {
      setPolicyName(currentPolicy.policyName);
    }
    if (currentPolicy.type) {
      setType(currentPolicy.type);
    }
    if (currentPolicy.state) {
      setState(currentPolicy.state);
    }
    if (currentPolicy.content && currentPolicy.content !== editorState) {
      setEditorState(currentPolicy.content);
    }
  }, [currentPolicy.id]);

  useEffect(() => {
    if (instructionsActive.length > 0) {
      const update = instructionsActive.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryInstructions(update);
    }
    if (directivesActive.length > 0) {
      const update = directivesActive.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryDirectives(update);
    }
  }, [isLoadingGetPolicies, isFetchingGetPolicies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpenSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const arrayTypes = [
    { id: "Директива", value: "Директива" },
    { id: "Инструкция", value: "Инструкция" },
  ];

  const arrayState = [
    { id: "Черновик", value: "Черновик" },
    { id: "Активный", value: "Активный" },
    { id: "Отменён", value: "Отменён" },
  ];

  const btnYes = () => {
    saveDeleteFolder();
  };

  const btnNo = () => {
    setOpenModalDeleteDirectory(false);
  };

  return (
    <div className={classes.dialog}>
      <Headers name={"политика"}>
        <BottomHeaders create={savePostPolicy} update={saveUpdatePolicy}>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Название политики <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                title="Название политики"
                className={`${classes.five} ${classes.textMontserrat14}`}
                disabled={disabledArchive}
              ></input>
              <div className={classes.sixth} ref={selectRef}>
                <img
                  src={subbarSearch}
                  alt="subbarSearch"
                  onClick={() => setIsOpenSearch(true)}
                />
                {isOpenSearch && (
                  <ul className={classes.policySearch}>
                    <li className={classes.policySearchItemNested}>
                      <div className={classes.listUL}>
                        <img src={folder} alt="folder" />
                        <div className={classes.listText}>Директивы</div>
                        <img
                          src={iconSublist}
                          alt="iconSublist"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <ul className={classes.listULElementNested}>
                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.activeText}`}
                            >
                              Активные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {directivesActive?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  getPolicyId(item.id);
                                  setIsOpenSearch(false);
                                }}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.draftText}`}
                            >
                              Черновики
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {directivesDraft?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  getPolicyId(item.id);
                                  setIsOpenSearch(false);
                                }}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.completedText}`}
                            >
                              Завершенные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {directivesCompleted?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  getPolicyId(item.id);
                                  setDisabledArchive(true);
                                  setIsOpenSearch(false);
                                }}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className={classes.policySearchItemNested}>
                      <div className={classes.listUL}>
                        <img src={folder} alt="folder" />
                        <div className={classes.listText}>Инструкции</div>
                        <img
                          src={iconSublist}
                          alt="iconSublist"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <ul className={classes.listULElementNested}>
                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.activeText}`}
                            >
                              Активные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {instructionsActive?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  getPolicyId(item.id);
                                  setIsOpenSearch(false);
                                }}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.draftText}`}
                            >
                              Черновики
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {instructionsDraft?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  getPolicyId(item.id);
                                  setIsOpenSearch(false);
                                }}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.completedText}`}
                            >
                              Завершенные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {instructionsCompleted?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => {
                                  getPolicyId(item.id);
                                  setDisabledArchive(true);
                                  setIsOpenSearch(false);
                                }}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </li>

                    {foldersSort?.map((item) => {
                      let hasInstruction = false;
                      let hasDirective = false;
                      return (
                        <li className={classes.policySearchItem} key={item.id}>
                          <div
                            className={classes.listUL}
                            onClick={() => updateDirectory(item)}
                          >
                            <img src={folder} alt="folder" />
                            <div className={classes.listText}>
                              {item.directoryName}
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElement}>
                            {item.policyToPolicyDirectories?.map((element) => {
                              const isInstruction =
                                element.policy.type === "Инструкция";

                              let instructionHeader = null;

                              if (isInstruction && !hasInstruction) {
                                hasInstruction = true;
                                instructionHeader = (
                                  <li
                                    key="instruction-header"
                                    className={`${classes.headerText}`}
                                  >
                                    Инструкции
                                  </li>
                                );
                              }

                              const isDirective =
                                element.policy.type === "Директива";

                              let directiveHeader = null;

                              if (isDirective && !hasDirective) {
                                hasDirective = true;
                                directiveHeader = (
                                  <li
                                    key="directive-header"
                                    className={`${classes.headerText}`}
                                  >
                                    Директивы
                                  </li>
                                );
                              }

                              return (
                                <React.Fragment key={element.policy.id}>
                                  {directiveHeader}
                                  {instructionHeader}
                                  <li
                                    onClick={() => {
                                      getPolicyId(element.policy.id);
                                      setIsOpenSearch(false);
                                    }}
                                    className={classes.textMontserrat}
                                  >
                                    {element.policy.policyName}
                                  </li>
                                </React.Fragment>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}

                    <li className={classes.policySearchItem}>
                      <div
                        className={classes.listUL}
                        onClick={openCreateDirectory}
                      >
                        <img src={addCircleBlue} alt="addCircleBlue" />
                        <div className={classes.listText}>Создать папку</div>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          {currentPolicy.id && (
            <>
              <Select
                name={"Тип"}
                value={type}
                onChange={setType}
                array={arrayTypes}
                arrayItem={"value"}
                disabledPole={disabledArchive}
              ></Select>
              <Select
                name={"Состояние"}
                value={state}
                onChange={setState}
                array={arrayState}
                arrayItem={"value"}
                disabledPole={disabledArchive}
              ></Select>
            </>
          )}
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
        {isErrorPostPoliciesMutation ||
        (isErrorGetPolicies && isErrorGetPolicyDirectories) ? (
          <>
            <HandlerQeury
              Error={
                isErrorGetPolicies ||
                isErrorGetPolicyDirectories ||
                isErrorPostPoliciesMutation
              }
            ></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetPoliciesId ? (
              <HandlerQeury Error={isErrorGetPoliciesId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury
                  Loading={isLoadingGetPolicies}
                  Fetching={isFetchingGetPolicies}
                ></HandlerQeury>

                <HandlerQeury
                  Loading={isLoadingGetPolicyDirectories}
                  Fetching={isFetchingGetPolicyDirectories}
                ></HandlerQeury>

                {isFetchingGetPoliciesId || isLoadingGetPoliciesId ? (
                  <HandlerQeury
                    Loading={isLoadingGetPoliciesId}
                    Fetching={isFetchingGetPoliciesId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentPolicy.content ? (
                      <>
                        <Mdxeditor
                          key={currentPolicy.id}
                          editorState={currentPolicy.content}
                          setEditorState={setEditorState}
                          readOnly={disabledArchive}
                        ></Mdxeditor>

                        <HandlerMutation
                          Loading={isLoadingPostPoliciesMutation}
                          Error={
                            isErrorPostPoliciesMutation &&
                            localIsResponsePostPoliciesMutation
                          }
                          Success={
                            isSuccessPostPoliciesMutation &&
                            localIsResponsePostPoliciesMutation
                          }
                          textSuccess={"Политика успешно создана."}
                          textError={
                            ErrorPostPoliciesMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPostPoliciesMutation.data.errors[0]
                                  .errors[0]
                              : ErrorPostPoliciesMutation?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingUpdatePoliciesMutation}
                          Error={
                            isErrorUpdatePoliciesMutation &&
                            localIsResponseUpdatePoliciesMutation
                          }
                          Success={
                            isSuccessUpdatePoliciesMutation &&
                            localIsResponseUpdatePoliciesMutation
                          }
                          textSuccess={`Политика ${policyName} обновлена`}
                          textError={
                            ErrorUpdatePoliciesMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdatePoliciesMutation.data.errors[0]
                                  .errors[0]
                              : ErrorUpdatePoliciesMutation?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите политику"}
                        ></WaveLetters>
                      </>
                    )}

                    <HandlerMutation
                      Loading={isLoadingPostPoliciesDirectoriesMutation}
                      Error={
                        isErrorPostPoliciesDirectoriesMutation &&
                        localIsResponsePostPolicyDirectoriesMutation
                      }
                      Success={
                        isSuccessPostPoliciesDirectoriesMutation &&
                        localIsResponsePostPolicyDirectoriesMutation
                      }
                      textSuccess={`Папка ${directoryName} создана`}
                      textError={
                        ErrorPostPoliciesDirectoriesMutation?.data?.errors?.[0]
                          ?.errors?.[0]
                          ? ErrorPostPoliciesDirectoriesMutation.data.errors[0]
                              .errors[0]
                          : ErrorPostPoliciesDirectoriesMutation?.data?.message
                      }
                    ></HandlerMutation>

                    <HandlerMutation
                      Loading={isLoadingUpdatePolicyDirectoriesMutation}
                      Error={
                        isErrorUpdatePolicyDirectoriesMutation &&
                        localIsResponseUpdatePolicyDirectoriesMutation
                      }
                      Success={
                        isSuccessUpdatePolicyDirectoriesMutation &&
                        localIsResponseUpdatePolicyDirectoriesMutation
                      }
                      textSuccess={`Папка ${currentDirectoryName} обновлена`}
                      textError={
                        ErrorUpdateDirectories?.data?.errors?.[0]?.errors?.[0]
                          ? ErrorUpdateDirectories.data.errors[0].errors[0]
                          : ErrorUpdateDirectories?.data?.message
                      }
                    ></HandlerMutation>

                    <HandlerMutation
                      Loading={isLoadingDeletePolicyDirectoriesMutation}
                      Error={
                        isErrorDeletePolicyDirectoriesMutation &&
                        localIsResponseDeletePolicyDirectoriesMutation
                      }
                      Success={
                        isSuccessDeletePolicyDirectoriesMutation &&
                        localIsResponseDeletePolicyDirectoriesMutation
                      }
                      textSuccess={`Папка ${currentDirectoryName} удалена`}
                      textError={
                        ErrorDeleteDirectories?.data?.errors?.[0]?.errors?.[0]
                          ? ErrorDeleteDirectories.data.errors[0].errors[0]
                          : ErrorDeleteDirectories?.data?.message
                      }
                    ></HandlerMutation>

                    {openModalCreateDirectory && (
                      <ModalFolder
                        searchArrayDirectives={filterArraySearchModalDirectives}
                        searchArrayInstructions={
                          filterArraySearchModalInstructions
                        }
                        arrayDirectives={directivesActive}
                        arrayInstructions={instructionsActive}
                        handleInputChangeModalSearch={
                          handleInputChangeModalSearch
                        }
                        inputSearchModalDirectory={inputSearchModalDirectory}
                        handleCheckboxChange={handleCheckboxChange}
                        directoryName={directoryName}
                        setDirectoryName={setDirectoryName}
                        save={saveFolder}
                        setOpenModalDeleteDirectory={
                          setOpenModalDeleteDirectory
                        }
                        exit={exitCreateDirectory}
                      ></ModalFolder>
                    )}

                    {openModalUpdateDirectory && (
                      <ModalFolder
                        searchArrayDirectives={filterArraySearchModalDirectives}
                        searchArrayInstructions={
                          filterArraySearchModalInstructions
                        }
                        arrayDirectives={currentDirectoryDirectives}
                        arrayInstructions={currentDirectoryInstructions}
                        handleInputChangeModalSearch={
                          handleInputChangeModalSearch
                        }
                        inputSearchModalDirectory={inputSearchModalDirectory}
                        handleCheckboxChange={handleCheckboxChangeUpdate}
                        directoryName={currentDirectoryName}
                        setDirectoryName={setCurrentDirectoryName}
                        save={saveUpdateFolder}
                        setOpenModalDeleteDirectory={
                          setOpenModalDeleteDirectory
                        }
                        exit={exitUpdateDirectory}
                        buttonDelete={true}
                      ></ModalFolder>
                    )}

                    {openModalDeleteDirectory && (
                      <ModalWindow
                        text={` Вы точно хотите удалить папку ${currentDirectoryName}`}
                        close={setOpenModalDeleteDirectory}
                        btnYes={btnYes}
                        btnNo={btnNo}
                      ></ModalWindow>
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
