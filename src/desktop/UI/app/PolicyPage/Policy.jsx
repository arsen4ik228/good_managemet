import React, { useState, useEffect, useRef } from "react";
import classes from "./Policy.module.css";

import subbarSearch from "../../image/subbarSearch.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";

import folder from "../../image/folder.svg";
import iconSublist from "../../image/iconSublist.svg";
import deleteGrey from "../../image/deleteGrey.svg";
import {
  usePostPoliciesMutation,
  useGetPoliciesQuery,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
} from "../../../BLL/policyApi.js";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import addCircleBlue from "../../image/addCircleBlue.svg";
import exitModal from "../../image/exitModal.svg";
import WaveLetters from "../../Custom/WaveLetters.jsx";
import Mdxeditor from "../../Custom/Mdxeditor/Mdxeditor.jsx";
import Headers from "../../Custom/Headers/Headers.jsx";
import BottomHeaders from "../../Custom/Headers/BottomHeaders/BottomHeaders.jsx";
import Select from "../../Custom/Select/Select.jsx";
import { useDirectories } from "./hooks/Directories";
import useGetOldAndNewOrganizationId from "UI/hooks/useGetReduxOrganization";
import ModalFolder from "@Custom/modalFolder/ModalFolder";
import ModalWindow from "@Custom/ModalWindow";

export default function Policy() {
  const selectRef = useRef(null);

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [editorState, setEditorState] = useState("");
  const [disabledArchive, setDisabledArchive] = useState(false);

  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [manualCreateSuccessReset, setManualCreateSuccessReset] =
    useState(false);
  const [manualCreateErrorReset, setManualCreateErrorReset] = useState(false);

  const { reduxNewSelectedOrganizationId } = useGetOldAndNewOrganizationId();

  const [
    postPolicy,
    {
      isLoading: isLoadingPostPoliciesMutation,
      isSuccess: isSuccessPostPoliciesMutation,
      isError: isErrorPostPoliciesMutation,
      error: ErrorPostPolicies,
    },
  ] = usePostPoliciesMutation();

  const savePostPolicy = async () => {
    await postPolicy({
      policyName: "Политика",
      content: " ",
      organizationId: reduxNewSelectedOrganizationId,
    })
      .unwrap()
      .then((result) => {
        setSelectedPolicyId(result.id);
        setManualCreateSuccessReset(false);
        setManualCreateErrorReset(false);
      })
      .catch((error) => {
        setManualCreateErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const {
    instructionsActive = [],
    instructionsDraft = [],
    instructionsCompleted = [],

    directivesActive = [],
    directivesDraft = [],
    directivesCompleted = [],

    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,
  } = useGetPoliciesQuery(
    { organizationId: reduxNewSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        isLoadingGetPolicies: isLoading,
        isErrorGetPolicies: isError,
        isFetchingGetPolicies: isFetching,
        directives: data?.directives || [],
        instructions: data?.instructions || [],

        instructionsActive: data?.instructionsActive || [],
        instructionsDraft: data?.instructionsDraft || [],
        instructionsCompleted: data?.instructionsCompleted || [],

        directivesActive: data?.directivesActive || [],
        directivesDraft: data?.directivesDraft || [],
        directivesCompleted: data?.directivesCompleted || [],
      }),
    }
  );

  const {
    currentPolicy = {},
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,
  } = useGetPoliciesIdQuery(
    { policyId: selectedPolicyId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentPolicy: data?.currentPolicy || {},
        isLoadingGetPoliciesId: isLoading,
        isErrorGetPoliciesId: isError,
        isFetchingGetPoliciesId: isFetching,
      }),
      skip: !selectedPolicyId,
    }
  );

  const [
    updatePolicy,
    {
      isLoading: isLoadingUpdatePoliciesMutation,
      isSuccess: isSuccessUpdatePoliciesMutation,
      isError: isErrorUpdatePoliciesMutation,
      error: Error,
    },
  ] = useUpdatePoliciesMutation();

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
    foldersSort,

    //Получение папок
    isLoadingGetPolicyDirectoriesMutation,
    isErrorGetPolicyDirectoriesMutation,
    isFetchingGetPolicyDirectoriesMutation,

    //Создание папки
    openModalCreateDirectory,

    openCreateDirectory,
    exitCreateDirectory,

    saveFolder,

    manualCreateSuccessResetDirectory,
    setManualCreateSuccessResetDirectory,
    manualCreateErrorResetDirectory,
    setManualCreateErrorResetDirectory,

    isLoadingPostPolicyDirectoriesMutation,
    isSuccessPostPolicyDirectoriesMutation,
    isErrorPostPolicyDirectoriesMutation,
    ErrorPolicyDirectories,

    //Обновление папки
    openModalUpdateDirectory,

    updateDirectory,
    exitUpdateDirectory,

    saveUpdateFolder,

    manualUpdateSuccessResetDirectory,
    setManualUpdateSuccessResetDirectory,
    manualUpdateErrorResetDirectory,
    setManualUpdateErrorResetDirectory,

    isLoadingUpdatePolicyDirectoriesMutation,
    isSuccessUpdatePolicyDirectoriesMutation,
    isErrorUpdatePolicyDirectoriesMutation,
    ErrorUpdateDirectories,

    //Удаление папки
    openModalDeleteDirectory,
    setOpenModalDeleteDirectory,

    saveDeleteFolder,

    manualDeleteSuccessResetDirectory,
    setManualDeleteSuccessResetDirectory,
    manualDeleteErrorResetDirectory,
    setManualDeleteErrorResetDirectory,

    isLoadingDeletePolicyDirectoriesMutation,
    isSuccessDeletePolicyDirectoriesMutation,
    isErrorDeletePolicyDirectoriesMutation,
    ErrorDeleteDirectories,

    handleInputChangeModalSearch,
    handleCheckboxChange,
    handleCheckboxChangeUpdate,
  } = useDirectories({ instructionsActive, directivesActive });

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
      .then(() => {
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const getPolicyId = (id) => {
    setManualUpdateSuccessResetDirectory(true);
    setManualUpdateErrorResetDirectory(true);

    setManualCreateSuccessResetDirectory(true);
    setManualCreateErrorResetDirectory(true);

    setManualDeleteSuccessResetDirectory(true);
    setManualDeleteErrorResetDirectory(true);

    setSelectedPolicyId(id);

    setManualSuccessReset(true);
    setManualErrorReset(true);

    setManualCreateSuccessReset(true);
    setManualCreateErrorReset(true);
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
    setManualDeleteSuccessResetDirectory(true);
    setManualDeleteErrorResetDirectory(true);
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
        (isErrorGetPolicies && isErrorGetPolicyDirectoriesMutation) ? (
          <>
            <HandlerQeury
              Error={
                isErrorGetPolicies ||
                isErrorGetPolicyDirectoriesMutation ||
                isErrorPostPoliciesMutation
              }
            ></HandlerQeury>
          </>
        ) : (
          <>
            {isLoadingPostPoliciesMutation && (
              <HandlerQeury Error={isErrorGetPoliciesId}></HandlerQeury>
            )}
            {isErrorGetPoliciesId ? (
              <HandlerQeury Error={isErrorGetPoliciesId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury
                  Loading={isLoadingGetPolicies}
                  Fetching={isFetchingGetPolicies}
                ></HandlerQeury>

                <HandlerQeury
                  Loading={isLoadingGetPolicyDirectoriesMutation}
                  Fetching={isFetchingGetPolicyDirectoriesMutation}
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
                          Loading={isLoadingPostPolicyDirectoriesMutation}
                          Error={
                            isErrorPostPolicyDirectoriesMutation &&
                            !manualCreateErrorResetDirectory
                          }
                          Success={
                            isSuccessPostPolicyDirectoriesMutation &&
                            !manualCreateSuccessResetDirectory
                          }
                          textSuccess={"Папка создана"}
                          textError={
                            ErrorPolicyDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPolicyDirectories.data.errors[0].errors[0]
                              : ErrorPolicyDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingUpdatePolicyDirectoriesMutation}
                          Error={
                            isErrorUpdatePolicyDirectoriesMutation &&
                            !manualUpdateErrorResetDirectory
                          }
                          Success={
                            isSuccessUpdatePolicyDirectoriesMutation &&
                            !manualUpdateSuccessResetDirectory
                          }
                          textSuccess={"Папка обновлена"}
                          textError={
                            ErrorUpdateDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdateDirectories.data.errors[0].errors[0]
                              : ErrorUpdateDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingDeletePolicyDirectoriesMutation}
                          Error={
                            isErrorDeletePolicyDirectoriesMutation &&
                            !manualDeleteErrorResetDirectory
                          }
                          Success={
                            isSuccessDeletePolicyDirectoriesMutation &&
                            !manualDeleteSuccessResetDirectory
                          }
                          textSuccess={"Папка удалена"}
                          textError={
                            ErrorDeleteDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorDeleteDirectories.data.errors[0].errors[0]
                              : ErrorDeleteDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingPostPoliciesMutation}
                          Error={
                            isErrorPostPoliciesMutation &&
                            !manualCreateSuccessReset
                          }
                          Success={
                            isSuccessPostPoliciesMutation &&
                            !manualCreateErrorReset
                          }
                          textSuccess={"Политика успешно создана."}
                          textError={
                            ErrorPostPolicies?.data?.errors?.[0]?.errors?.[0]
                              ? ErrorPostPolicies.data.errors[0].errors[0]
                              : ErrorPostPolicies?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingUpdatePoliciesMutation}
                          Error={
                            isErrorUpdatePoliciesMutation && !manualErrorReset
                          }
                          Success={
                            isSuccessUpdatePoliciesMutation &&
                            !manualSuccessReset
                          }
                          textSuccess={"Политика обновлена"}
                          textError={
                            Error?.data?.errors?.[0]?.errors?.[0]
                              ? Error.data.errors[0].errors[0]
                              : Error?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите политику"}
                        ></WaveLetters>

                        <HandlerMutation
                          Loading={isLoadingPostPolicyDirectoriesMutation}
                          Error={
                            isErrorPostPolicyDirectoriesMutation &&
                            !manualCreateErrorResetDirectory
                          }
                          Success={
                            isSuccessPostPolicyDirectoriesMutation &&
                            !manualCreateSuccessResetDirectory
                          }
                          textSuccess={"Папка создана"}
                          textError={
                            ErrorPolicyDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPolicyDirectories.data.errors[0].errors[0]
                              : ErrorPolicyDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingUpdatePolicyDirectoriesMutation}
                          Error={
                            isErrorUpdatePolicyDirectoriesMutation &&
                            !manualUpdateErrorResetDirectory
                          }
                          Success={
                            isSuccessUpdatePolicyDirectoriesMutation &&
                            !manualUpdateSuccessResetDirectory
                          }
                          textSuccess={"Папка обновлена"}
                          textError={
                            ErrorUpdateDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdateDirectories.data.errors[0].errors[0]
                              : ErrorUpdateDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingDeletePolicyDirectoriesMutation}
                          Error={
                            isErrorDeletePolicyDirectoriesMutation &&
                            !manualDeleteErrorResetDirectory
                          }
                          Success={
                            isSuccessDeletePolicyDirectoriesMutation &&
                            !manualDeleteSuccessResetDirectory
                          }
                          textSuccess={"Папка удалена"}
                          textError={
                            ErrorDeleteDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorDeleteDirectories.data.errors[0].errors[0]
                              : ErrorDeleteDirectories?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    )}

              
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
