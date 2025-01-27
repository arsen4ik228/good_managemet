import React, { useState, useEffect, useRef } from "react";
import classes from "./Program.module.css";
import icon from "../../../../image/iconHeader.svg";
import iconBack from "../../../../image/iconBack.svg";
import Listsetting from "../../../../image/Listsetting.svg";
import glazikBlack from "../../../../image/glazikBlack.svg";
import glazikInvisible from "../../../../image/glazikInvisible.svg";
import { useNavigate, useParams } from "react-router-dom";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import iconAdd from "../../../../image/iconAdd.svg";
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
  useGetProgramIdQuery,
  useGetProgramNewQuery,
} from "../../../../../BLL/projectApi.js";
import HandlerMutation from "../../../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../../../Custom/HandlerQeury.jsx";
import WaveLetters from "../../../../Custom/WaveLetters.jsx";
import TableProject from "../../../../Custom/TableProject/TableProject.jsx";
import Modal from "../../../../Custom/Modal/Modal.jsx";
import { useSelector } from "react-redux";
import Lupa from "../../../../Custom/Lupa/Lupa.jsx";
import TextArea from "../../../../Custom/TextArea/TextArea.jsx";
import BlockSections from "../../../../Custom/SectionsProject/BlockSections.jsx";

export default function Program() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/pomoshnik/startProject`);
  };
  const newProject = () => {
    navigate(`/${userId}/pomoshnik/programNew`);
  };

  const [organizationId, setOrganizationId] = useState(""); // Сначало выбираем организацию по ней проекты
  const [selectedProjectId, setSelectedProjectId] = useState(""); // Для выбора проекта

  // Поля которые получаю от Максона
  const [projectName, setProjectName] = useState();
  const [strategy, setStrategy] = useState("null");

  const [products, setProducts] = useState([]);
  const [event, setEvent] = useState([]);
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);

  // Все для Editor
  const [information, setInformation] = useState("");

  const [showEvent, setShowEvent] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showInformation, setShowInformation] = useState(false);

  const showTable = {
    Информация: { isShow: showInformation, setIsShow: setShowInformation },
    Продукт: { isShow: true },
    "Организационные мероприятия": {
      isShow: showEvent,
      setIsShow: setShowEvent,
    },
    Правила: { isShow: showRules, setIsShow: setShowRules },
    Задача: { isShow: true },
    Метрика: { isShow: showStatistics, setIsShow: setShowStatistics },
  };

  // Для создание массивов хуйни
  const [eventCreate, setEventCreate] = useState([]);
  const [rulesCreate, setRulesCreate] = useState([]);
  const [tasksCreate, setTaskCreate] = useState([]);
  const [statisticsCreate, setStatisticsCreate] = useState([]);

  // Для обработки ошибок
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  // Сортировка данных
  const [sortStrategies, setSortStrategies] = useState([]);

  // Disabled данных
  const [disabledTable, setDisabledTable] = useState(false);

  // Массив выбранных проектов которые присутвутствуют в выбранной программе по id
  const [arraySelectProjects, setArraySelectProjects] = useState([]);
  const [openModalProject, setOpenModalProject] = useState(false);

  //Проекты для добавления к программе
  //Для отображения в модальном окне данные
  const [projectsToAddProgram, setProjectsToAddProgram] = useState([]);
  //Для отправки на сервер данные
  const [selectProjectsModalId, setSelectProjectsModalId] = useState([]);

  //Лупа
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const [lengthReceivedEvent, setLengthReceivedEvent] = useState([]);
  const [lengthReceivedTasks, setLengthReceivedTasks] = useState([]);
  const [lengthReceivedRules, setLengthReceivedRules] = useState([]);
  const [lengthReceivedStatistic, setLengthReceivedStatistic] = useState([]);

  const nameTableRecieved = {
    Продукт: { array: products, setArray: setProducts, isShow: true },
    "Организационные мероприятия": {
      array: event,
      setArray: setEvent,
      isShow: showEvent,
    },
    Правила: { array: rules, setArray: setRules, isShow: showRules },
    Обычная: { array: tasks, setArray: setTasks, isShow: true },
    Статистика: {
      array: statistics,
      setArray: setStatistics,
      isShow: showStatistics,
    },
  };

  const nameTableCreated = {
    Обычная: {
      _array: tasksCreate,
      _setArray: setTaskCreate,
      lengthReceived: lengthReceivedTasks,
    },

    "Организационные мероприятия": {
      _array: eventCreate,
      _setArray: setEventCreate,
      lengthReceived: lengthReceivedEvent,
    },
    Правила: {
      _array: rulesCreate,
      _setArray: setRulesCreate,
      lengthReceived: lengthReceivedRules,
    },
    Статистика: {
      _array: statisticsCreate,
      _setArray: setStatisticsCreate,
      lengthReceived: lengthReceivedStatistic,
    },
  };

  const {
    programs = [],
    archivesPrograms = [],
    isErrorGetProject,
    isLoadingGetProject,
  } = useGetProjectQuery(
    { userId, organizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        programs: data?.programs || [],
        archivesPrograms: data?.archivesPrograms || [],
        isErrorGetProject: isError,
        isLoadingGetProject: isLoading,
      }),
      skip: !organizationId,
    }
  );

  const {
    currentProgram = {},
    currentProjects = [],
    targets = [],
    isLoadingGetProjectId,
    isErrorGetProjectId,
    isFetchingGetProjectId,
  } = useGetProgramIdQuery(
    { userId, programId: selectedProjectId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentProgram: data?.currentProgram || {},
        currentProjects: data?.currentProjects || [],
        targets: data?.targets || [],
        isLoadingGetProjectId: isLoading,
        isErrorGetProjectId: isError,
        isFetchingGetProjectId: isFetching,
      }),
      skip: !selectedProjectId,
    }
  );

  //Для добавления проектов в программу
  const {
    projects = [],
    workers = [],
    strategies = [],
    organizations = [],
    isLoadingGetProgram,
    isErrorGetProgram,
  } = useGetProgramNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      projects: data?.projects || [],
      workers: data?.workers || [],
      strategies: data?.strategies || [],
      organizations: data?.organizations || [],
      isLoadingGetProgram: isLoading,
      isErrorGetProgram: isError,
    }),
  });

  const [
    updateProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation();

  const programCreatedId = useSelector(
    (state) => state.program.programCreatedId
  );
  const organizationProgramId = useSelector(
    (state) => state.program.organizationProgramId
  );

  useEffect(() => {
    if (organizationProgramId) {
      setOrganizationId(organizationProgramId);
    }
  }, []);

  //Проекты для добавления к программе
  useEffect(() => {
    if (projects.length > 0 && organizationId) {
      const _array = projects?.filter(
        (item) => item?.organization?.id === organizationId
      );

      const array = _array.map((item, index) => {
        const targetWithProductType = item.targets.find(
          (target) => target.type === "Продукт"
        );

        if (targetWithProductType) {
          const worker = workers.find(
            (worker) => worker.id === targetWithProductType?.holderUserId
          );
          return {
            id: item?.id,
            nameProject: item?.projectName,
            orderNumber: index + 1,
            content: targetWithProductType?.content,
            holderUserId: worker?.id || "",
            deadline: targetWithProductType?.deadline || "",
          };
        }
        return {
          id: item?.id,
          nameProject: item?.projectName,
          orderNumber: index + 1,
          content: "",
          holderUserId: "",
          deadline: "",
        };
      });
      setProjectsToAddProgram(array);
    }
  }, [organizationId, projects, workers, isLoadingProjectMutation]);

  // После выбора другой организации обнуляю все переменные
  useEffect(() => {
    if (organizationId) {
      setSelectedProjectId("");

      setProducts([]);
      setEvent([]);
      setRules([]);
      setTasks([]);
      setStatistics([]);

      setEventCreate([]);
      setRulesCreate([]);
      setTaskCreate([]);
      setStatisticsCreate([]);

      setInformation("");
    }
  }, [organizationId]);

  // Для правильных данный sortStrategies
  useEffect(() => {
    if (organizationId) {
      const filteredStrategies = strategies?.filter(
        (strategy) => strategy?.organization?.id === organizationId
      );
      setSortStrategies(filteredStrategies);
      if (programCreatedId) {
        setSelectedProjectId(programCreatedId); // для того чтобы открывалась созданная программа
      }
    }
  }, [organizationId]);

  // Начальная инициализация данных при открытии по id
  useEffect(() => {
    if (currentProgram?.projectName) {
      setProjectName(currentProgram.projectName);
    }

    if (currentProgram?.strategy?.id) {
      setStrategy(currentProgram.strategy.id);
    }

    if (currentProgram?.content) {
      setInformation(currentProgram.content);
      setShowInformation(currentProgram.content.length > 0);
    }
  }, [currentProgram.id]);

  useEffect(() => {
    if (targets.length > 0) {
      setProducts(
        targets
          .filter((item) => item.type === "Продукт")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
      );

      setTasks(
        targets
          .filter((item) => item.type === "Обычная")
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
      );

      setEvent(() => {
        const array = targets
          .filter((item) => item.type === "Организационные мероприятия")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber);
        setLengthReceivedEvent(array.length);
        setShowEvent(array.length > 0);
        return array;
      });

      setRules(() => {
        const array = targets
          .filter((item) => item.type === "Правила")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber);
        setLengthReceivedRules(array.length);
        setShowRules(array.length > 0);
        return array;
      });

      setStatistics(() => {
        const array = targets
          .filter((item) => item.type === "Статистика")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber);
        setLengthReceivedStatistic(array.length);
        setShowStatistics(array.length > 0);
        return array;
      });
    }
  }, [targets, isLoadingGetProjectId, isFetchingGetProjectId]);

  useEffect(() => {
    if (currentProjects?.length > 0) {
      const array = currentProjects?.map((item, index) => {
        const targetWithProductType = item.targets.find(
          (target) => target.type === "Продукт"
        );

        if (targetWithProductType) {
          const worker = workers?.find(
            (worker) => worker.id === targetWithProductType?.holderUserId
          );
          return {
            id: item?.id,
            nameProject: item?.projectName,
            orderNumber: index + 1,
            content: targetWithProductType?.content,
            holderUserId: worker?.id,
            deadline: targetWithProductType?.deadline,
          };
        }
        return {
          id: item?.id,
          nameProject: item?.projectName,
          orderNumber: index + 1,
          content: "",
          holderUserId: "",
          deadline: "",
        };
      });
      setTasks(array);
      setArraySelectProjects(array?.map(({ id, ...rest }) => id));
      setLengthReceivedTasks(array.length);
    }
  }, [currentProjects]);

  // Обнуление переменных при удачном завершении обновления
  const reset = () => {
    setEventCreate([]);
    setRulesCreate([]);
    setTaskCreate([]);
    setStatisticsCreate([]);

    setProjectsToAddProgram([]);
    setSelectProjectsModalId([]);
  };

  //Сохранение изменений
  const saveUpdateProject = async () => {
    const projectIds = arraySelectProjects;

    const Data = {};

    Data.targetUpdateDtos = [];
    Data.targetCreateDtos = [];
    Data.type = "Программа";

    // Проверки на изменения и отсутствие null

    if (projectName !== currentProgram.projectName) {
      Data.projectName = projectName;
    }

    if (strategy !== currentProgram.strategyId && strategy !== "null") {
      Data.strategyId = strategy;
    }
    if (information !== currentProgram.content) {
      Data.content = information;
    }

    if (selectProjectsModalId.length > 0) {
      projectIds.push(...selectProjectsModalId);
    }

    if (products.length > 0) {
      Data.targetUpdateDtos = [
        ...products.map(
          ({ isExpired, id, holderUserId, holderUserIdchange, ...rest }) => {
            if (holderUserId === holderUserIdchange) {
              return {
                _id: id,
                ...rest,
              };
            } else {
              return {
                _id: id,
                ...rest,
                holderUserId,
              };
            }
          }
        ),
      ];
    }

    if (event.length > 0) {
      const array = event.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );

      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }
    if (rules.length > 0) {
      const array = rules.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );

      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }
    if (statistics.length > 0) {
      const array = statistics.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );

      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }

    if (eventCreate.length > 0) {
      Data.targetCreateDtos = [
        ...eventCreate.map(({ id, ...rest }, index) => ({
          ...rest,
          orderNumber: event.length + index + 1,
        })),
      ];
    }
    if (rulesCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...rulesCreate.map(({ id, ...rest }, index) => ({
          ...rest,
          orderNumber: rules.length + index + 1,
        })),
      ];
    }
    if (statisticsCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...statisticsCreate.map(({ id, ...rest }, index) => ({
          ...rest,
          orderNumber: statistics.length + index + 1,
        })),
      ];
    }

    if (Data.targetCreateDtos.length === 0) {
      delete Data.targetCreateDtos;
    }

    await updateProject({
      userId,
      projectId: selectedProjectId,
      _id: selectedProjectId,
      projectIds: projectIds,
      ...Data,
    })
      .unwrap()
      .then(() => {
        reset();
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  // Методы для таблиц
  const add = (name) => {
    const data = nameTableCreated[name];
    const { _array, _setArray } = data;

    _setArray((prevState) => {
      const index = prevState.length + 1; // Генерация index на основе длины массива

      return [
        ...prevState,
        {
          id: new Date(),
          type: name,
          orderNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  const deleteRow = (name, id) => {
    const data = nameTableCreated[name];
    const { _array, _setArray } = data;
    const updated = _array
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        orderNumber: index + 1,
      }));
    _setArray(updated);
  };

  // Для выбранных проектов
  const handleCheckBox = (id) => {
    setArraySelectProjects((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCheckBoxModal = (id) => {
    setSelectProjectsModalId((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    setTaskCreate((prev) => {
      const project = projectsToAddProgram.find((item) => item.id === id);
      return prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, project];
    });
  };

  useEffect(() => {
    if (selectedProjectId) {
      setManualSuccessReset(true);
      setManualErrorReset(true);

      if (archivesPrograms.some((item) => item.id === selectedProjectId)) {
        setDisabledTable(true);
      } else {
        setDisabledTable(false);
      }
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (archivesPrograms.some((item) => item.id === selectedProjectId)) {
      setDisabledTable(true);
    }
  }, [archivesPrograms]);

  return (
    <div className={classes.dialog}>
      <div className={classes.header}>
        <div className={classes.fon}></div>
        <div className={classes.pomoshnikSearch}>
          <div className={classes.pomoshnik}>
            <img
              src={iconBack}
              alt="iconBack"
              onClick={() => back()}
              className={classes.iconBack}
            />
            <div>
              <img
                src={icon}
                alt="icon"
                style={{ width: "33px", height: "33px" }}
              />
            </div>

            <div className={classes.spanPomoshnik}>
              <span>Личный помощник</span>
            </div>
          </div>
          <input type="search" placeholder="Поиск" className={classes.search} />
        </div>

        <div className={classes.editText}>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Организация <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                className={classes.select}
                value={organizationId}
                onChange={(e) => {
                  setOrganizationId(e.target.value);
                }}
              >
                <option value="" disabled>
                  Выберите организацию
                </option>
                {organizations?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.organizationName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {organizationId && (
            <div className={classes.item}>
              <div className={classes.itemName}>
                <span>
                  Выберите программу <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <div className={classes.div}>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  className={classes.select}
                  disabled={disabledTable}
                />
                <Lupa
                  setIsOpenSearch={setIsOpenSearch}
                  isOpenSearch={isOpenSearch}
                  select={setSelectedProjectId}
                  programs={programs}
                  archivesPrograms={archivesPrograms}
                ></Lupa>
              </div>
            </div>
          )}

          {selectedProjectId && (
            <>
              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>
                    Выбрать стратегию <span style={{ color: "red" }}>*</span>
                  </span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    value={strategy}
                    onChange={(e) => {
                      setStrategy(e.target.value);
                    }}
                    className={classes.select}
                    disabled={disabledTable}
                  >
                    <option value="null" disabled>
                      Выбрать стратегию
                    </option>
                    {sortStrategies.map((item) => {
                      return (
                        <option
                          key={item.id}
                          value={item.id}
                          className={` ${
                            item.state === "Активный" ? classes.active : ""
                          }`}
                        >
                          Стратегия №{item.strategyNumber}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </>
          )}

          <BlockSections showTable={showTable}></BlockSections>

          <div className={classes.actionButton}>
            <div className={classes.iconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.image}
                onClick={() => newProject()}
              />
            </div>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => saveUpdateProject()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetProject || isErrorGetProgram ? (
          <>
            <HandlerQeury
              Error={isErrorGetProject || isErrorGetProgram}
            ></HandlerQeury>
          </>
        ) : (
          <>
            <HandlerQeury
              Loading={isLoadingGetProject || isLoadingGetProgram}
            ></HandlerQeury>

            {isErrorGetProjectId ? (
              <HandlerQeury Error={isErrorGetProjectId}></HandlerQeury>
            ) : (
              <>
                {isLoadingGetProjectId || isFetchingGetProjectId ? (
                  <HandlerQeury
                    Loading={isLoadingGetProjectId}
                    Fetching={isFetchingGetProjectId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentProgram.id ? (
                      <>
                        {showInformation && (
                          <TextArea
                            value={information}
                            onChange={setInformation}
                            readOnly={disabledTable}
                          ></TextArea>
                        )}

                        {Object.keys(nameTableRecieved).map((key) => {
                          const { array, setArray, isShow } =
                            nameTableRecieved[key];

                          const {
                            _array = [],
                            _setArray = () => {},
                            lengthReceived,
                          } = nameTableCreated[key] || {};

                          return (
                            isShow && (
                              <TableProject
                                tableKey={key}
                                nameTable={key}
                                add={add}
                                array={array}
                                setArray={setArray}
                                _array={_array}
                                _setArray={_setArray}
                                workers={workers}
                                deleteRow={deleteRow}
                                disabledTable={disabledTable}
                                disabledProject={true}
                                handleCheckBox={handleCheckBox}
                                arraySelectProjects={arraySelectProjects}
                                updateProgramm={true}
                                openModal={setOpenModalProject}
                                lengthReceived={lengthReceived}
                              />
                            )
                          );
                        })}

                        {openModalProject && (
                          <Modal
                            array={projectsToAddProgram}
                            exitModal={setOpenModalProject}
                            handleCheckBoxModal={handleCheckBoxModal}
                            selectProjectsModalId={selectProjectsModalId}
                          ></Modal>
                        )}

                        <HandlerMutation
                          Loading={isLoadingProjectMutation}
                          Error={isErrorProjectMutation && !manualErrorReset}
                          Success={
                            isSuccessProjectMutation && !manualSuccessReset
                          }
                          textSuccess={"Обновлена"}
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
                          letters={"Выберите программу"}
                        ></WaveLetters>
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
