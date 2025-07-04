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
import { Card, Drawer, Table, Tabs, Tour } from "antd";
import dayjs from "dayjs";
import { MenuOutlined, VerticalRightOutlined, RollbackOutlined } from "@ant-design/icons"
import { PolicyNavigationBar } from './components/PolicyNavigationBar.jsx'

import { Menu, Input, Tooltip, DatePicker, Button, Dropdown } from "antd";
import {
  FolderOutlined,
  DownOutlined,
  FileOutlined,
  PlusCircleOutlined,
  ExclamationOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import PolicyInputDropdown from "./components/PolicyInputDropdown";

export default function Policy() {
  const { policyId } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(true)

  useEffect(() => {
    if (policyId) {
      setSelectedPolicyId(policyId);
    }
  }, []);

  const selectRef = useRef(null);

  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [editorState, setEditorState] = useState("");
  const [disabledArchive, setDisabledArchive] = useState(false);

  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const refName = useRef(null);
  const refType = useRef(null);
  const refStatus = useRef(null);
  const refCreate = useRef(null);
  const refUpdate = useRef(null);

  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: "Название политики",
      description: "Здесь можно поменять название выбранной политики",
      target: () => refName.current, // Добавляем проверку
    },
    {
      title: "Выбрать политику",
      description: "Нажмите и выберите политику",
      target: () => selectRef.current, // Добавляем проверку
    },
    {
      title: "Тип политики",
      description: "Нажмите и поменяйте тип",
      target: () => (selectedPolicyId ? refType.current : null), // Добавляем проверку
      disabled: !selectedPolicyId,
    },
    {
      title: "Состояние политики",
      description: "Нажмите и поменяйте состояние",
      target: () => (selectedPolicyId ? refStatus.current : null), // Добавляем проверку
      disabled: !selectedPolicyId,
    },
    {
      title: "Создать",
      description: "Нажмите для создания стратегии",
      target: () => refCreate.current,
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => refUpdate.current,
    },
  ].filter((step) => !step.disabled); // Фильтруем шаги, у которых disabled=true;

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

    disposalsActive,
    disposalsDraft,
    disposalsCompleted,

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
    setCurrentDirectoryDisposals,

    directoriesSendBD,
    currentDirectoryName,
    setCurrentDirectoryName,

    directoryName,
    setDirectoryName,

    currentDirectoryInstructions,
    currentDirectoryDirectives,
    currentDirectoryDisposals,

    inputSearchModalDirectory,
    filterArraySearchModalDirectives,
    filterArraySearchModalInstructions,
    filterArraySearchModalDisposals,

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
  } = useDirectories({ instructionsActive, directivesActive, disposalsActive });

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
    if (
      (type !== null && currentPolicy.type !== type) ||
      type === "Распоряжение"
    ) {
      Data.type = type;
    }
    if (currentPolicy.deadline !== deadline) {
      Data.deadline = deadline;
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
        if (state === "Отменён") {
          setDisabledArchive(true);
        }
      })
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
    if (currentPolicy.deadline) {
      setDeadline(dayjs(currentPolicy.deadline));
    }
    if (currentPolicy.content && currentPolicy.content !== editorState) {
      setEditorState(currentPolicy.content);
    }

    setDisabledArchive(false);
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
    if (disposalsActive.length > 0) {
      const update = disposalsActive.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryDisposals(update);
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
    { id: "Распоряжение", value: "Распоряжение" },
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

  console.warn(foldersSort)
  return (
    <div className={classes.dialog}>
      <Headers name={"политика"} funcActiveHint={() => setOpen(true)}>
        <BottomHeaders
          create={savePostPolicy}
          update={saveUpdatePolicy}
          refCreate={refCreate}
          refUpdate={refUpdate}
        >
          {/* <PolicyInputDropdown
            policyName={policyName}
            setPolicyName={setPolicyName}
            disabledArchive={disabledArchive}
            // Коллбэки
            getPolicyId={getPolicyId}
            setDisabledArchive={setDisabledArchive}
            updateDirectory={updateDirectory}
            openCreateDirectory={openCreateDirectory}
            // Данные для меню
            directivesActive={directivesActive}
            directivesDraft={directivesDraft}
            directivesCompleted={directivesCompleted}
            instructionsActive={instructionsActive}
            instructionsDraft={instructionsDraft}
            instructionsCompleted={instructionsCompleted}
            disposalsActive={disposalsActive}
            disposalsDraft={disposalsDraft}
            disposalsCompleted={disposalsCompleted}
            foldersSort={foldersSort}
          /> */}
          <Button
            type="text"
            icon={drawerOpen ? <MenuOutlined /> : <MenuOutlined />}
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={classes.toggleButton}
          />

          {currentPolicy.id && (
            <>
              <Input
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                disabled={disabledArchive}
                style={{ width: '300px' }}
              ></Input>

              <Select
                refSelect={refType}
                name={"Тип"}
                value={type}
                onChange={setType}
                array={arrayTypes}
                arrayItem={"value"}
                disabledPole={disabledArchive}
              ></Select>
              <Select
                refSelect={refStatus}
                name={"Состояние"}
                value={state}
                onChange={setState}
                array={arrayState}
                arrayItem={"value"}
                disabledPole={disabledArchive}
              ></Select>
              {currentPolicy.type === "Распоряжение" && (
                <div className={classes.item}>
                  <div className={classes.itemName}>
                    <span>Дата окончания</span>
                  </div>
                  <DatePicker
                    format="DD.MM.YYYY"
                    value={deadline}
                    onChange={(date) => setDeadline(date)}
                  />
                </div>
              )}
            </>
          )}
        </BottomHeaders>
      </Headers>

      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />

      <PolicyNavigationBar
        directivesDraft={directivesDraft}
        instructionsDraft={instructionsDraft}
        disposalsDraft={disposalsDraft}
        directivesActive={directivesActive}
        instructionsActive={instructionsActive}
        disposalsActive={disposalsActive}
        directivesCompleted={directivesCompleted}
        instructionsCompleted={instructionsCompleted}
        disposalsCompleted={disposalsCompleted}
        foldersSort={foldersSort}

        policyId={selectedPolicyId}
        setPolicyId={setSelectedPolicyId}
        updateDirectory={updateDirectory}

        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      ></PolicyNavigationBar>

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
                        searchArrayDisposals={filterArraySearchModalDisposals}
                        // arrayDirectives={directivesActive}
                        // arrayInstructions={instructionsActive}
                        // arrayDisposals={disposalsActive}

                        arrayDirectives={currentDirectoryDirectives}
                        arrayInstructions={currentDirectoryInstructions}
                        arrayDisposals={currentDirectoryDisposals}
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
                        searchArrayDisposals={filterArraySearchModalDisposals}
                        arrayDirectives={currentDirectoryDirectives}
                        arrayInstructions={currentDirectoryInstructions}
                        arrayDisposals={currentDirectoryDisposals}
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
    </div >
  );
}
