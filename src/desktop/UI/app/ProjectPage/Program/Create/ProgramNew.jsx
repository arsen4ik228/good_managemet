import React, { useState, useEffect } from "react";
import classes from "./ProgramNew.module.css";
import icon from "../../../../image/iconHeader.svg";
import iconBack from "../../../../image/iconBack.svg";
import Listsetting from "../../../../image/Listsetting.svg";
import glazikBlack from "../../../../image/glazikBlack.svg";
import glazikInvisible from "../../../../image/glazikInvisible.svg";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import iconAddProjectBlue from "../../../../image/iconAddProjectBlue.svg";

import { useNavigate, useParams } from "react-router-dom";
import { usePostProjectMutation } from "../../../../../BLL/projectApi.js";

import HandlerMutation from "../../../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../../../Custom/HandlerQeury.jsx";

import TableProject from "../../../../Custom/TableProject/TableProject.jsx";
import { useGetProgramNewQuery } from "../../../../../BLL/projectApi.js";
import { useDispatch } from "react-redux";
import {
  setProgramCreatedId,
  setProgramOrganizationId,
} from "../../../../../BLL/Program/Slice/programSlice.js";
import TextArea from "../../../../Custom/TextArea/TextArea.jsx";
import BlockSections from "../../../../Custom/SectionsProject/BlockSections.jsx";

export default function ProgramNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/pomoshnik/program`);
  };
  const [name, setName] = useState("");

  const [strategy, setStrategy] = useState("null");

  const [products, setProducts] = useState([
    {
      type: "Продукт",
      orderNumber: 1,
      content: "",
      holderUserId: "",
      deadline: "",
    },
  ]);
  const [event, setEvent] = useState([]);
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);

  const [organizationId, setOrganizationId] = useState("");
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

  const [sortStrategies, setSortStrategies] = useState([]);

  // Массив выбранных проектов
  const [arraySelectProjects, setArraySelectProjects] = useState([]);

  const nameTable = {
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

  const dispatch = useDispatch();

  const {
    workers = [],
    strategies = [],
    organizations = [],
    projects = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetProgramNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      strategies: data?.strategies || [],
      organizations: data?.organizations || [],
      projects: data?.projects || [],
      isLoadingGetNew: isLoading,
      isErrorGetNew: isError,
    }),
  });

  const [
    postProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: Error,
    },
  ] = usePostProjectMutation();

  useEffect(() => {
    if (organizationId) {
      const array = strategies?.filter(
        (item) => item.organization.id === organizationId
      );
      setSortStrategies(array);

      const _array = projects?.filter(
        (item) => item.organization.id === organizationId
      );

      const filteredArray = _array?.map((project, index) => {
        const targetWithProductType = project.targets.find(
          (target) => target.type === "Продукт"
        );

        if (targetWithProductType) {
          const worker = workers.find(
            (worker) => worker.id === targetWithProductType.holderUserId
          );
          return {
            id: project.id,
            nameProject: project.projectName,
            orderNumber: index + 1,
            content: targetWithProductType.content,
            holderUserId: worker.id,
            deadline: targetWithProductType.deadline,
          };
        }

        return {
          id: project.id,
          nameProject: project.projectName,
          orderNumber: index + 1,
          content: null,
          holderUserId: null,
          deadline: null,
        };
      });
      setTasks(filteredArray);
    }
  }, [organizationId]);


  const reset = () => {
    setName("");
    setStrategy("null");

    setProducts([
      {
        type: "Продукт",
        orderNumber: 1,
        content: "",
        holderUserId: "",
        deadline: "",
      },
    ]);
    setEvent([]);
    setRules([]);
    setTasks([]);
    setStatistics([]);

    setInformation("");
  };

  const saveProject = async () => {
    const Data = {};
    Data.targetCreateDtos = [];

    Data.projectName = name;
    Data.type = "Программа";
    Data.organizationId = organizationId;

    if (strategy !== "null") {
      Data.strategyId = strategy;
    }

    if (information !== "") {
      Data.content = information;
    }

    if (arraySelectProjects.length > 0) {
      Data.projectIds = arraySelectProjects;
    }

    if (event.length > 0) {
      Data.targetCreateDtos = [...event.map(({ id, ...rest }) => rest)];
    }

    if (rules.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...rules.map(({ id, ...rest }) => rest),
      ];
    }

    if (statistics.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...statistics.map(({ id, ...rest }) => rest),
      ];
    }

    Data.targetCreateDtos = [...Data.targetCreateDtos, ...products];

    await postProject({
      userId,
      ...Data,
    })
      .unwrap()
      .then((result) => {
        reset();
        dispatch(setProgramCreatedId(result.id));
        dispatch(setProgramOrganizationId(organizationId));
        back();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const add = (name) => {
    const data = nameTable[name];
    const { array, setArray } = data;

    setArray((prevState) => {
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
    const data = nameTable[name];
    const { array, setArray } = data;
    const updated = array
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        orderNumber: index + 1,
      }));
    setArray(updated);
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

  const goToCreateProject = () => {
    navigate(`/${userId}/project/new`);
  };

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
                Название <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <input
                className={classes.select}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>

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
                    <option value={item.id}>{item.organizationName}</option>
                  );
                })}
              </select>
            </div>
          </div>

          {organizationId && (
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
                >
                  <option value="null" disabled>
                    Выберите стратегию
                  </option>
                  {sortStrategies.map((item) => {
                    return (
                      <option
                        value={item.id}
                        className={` ${
                          item.state === "Активный" ? classes.active : ""
                        }`}
                      >
                        Стратегия № {item.strategyNumber}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

<BlockSections showTable={showTable}></BlockSections>

          <div className={classes.iconSave}>
            <img
              src={Blacksavetmp}
              alt="Blacksavetmp"
              className={classes.image}
              onClick={() => saveProject()}
            />
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetNew ? (
          <HandlerQeury Error={isErrorGetNew}></HandlerQeury>
        ) : (
          <>
            {isLoadingGetNew ? (
              <HandlerQeury Loading={isLoadingGetNew}></HandlerQeury>
            ) : (
              <>
                <HandlerMutation
                  Loading={isLoadingProjectMutation}
                  Error={isErrorProjectMutation}
                  Success={isSuccessProjectMutation}
                  textSuccess={"Программа создана."}
                  textError={
                    Error?.data?.errors?.[0]?.errors?.[0]
                      ? Error.data.errors[0].errors[0]
                      : Error?.data?.message
                  }
                ></HandlerMutation>

                {showInformation && (
                  <TextArea value={information} onChange={setInformation}>
                  </TextArea>
                )}

                {tasks.length > 0 ? (
                  <>
                    {Object.keys(nameTable).map((key) => {
                      const { array, setArray, isShow } = nameTable[key]; // Деструктурируем данные
                      return (
                        isShow && (
                          <TableProject
                            key={key}
                            nameTable={key}
                            add={add}
                            deleteRow={deleteRow}
                            array={array}
                            setArray={setArray}
                            workers={workers}
                            createProgram={true}
                            handleCheckBox={handleCheckBox}
                            disabledProject={true}
                          />
                        )
                      );
                    })}
                  </>
                ) : (
                  <>
                    <div className={classes.noProjects}>
                      <span className={classes.textMontserrat}>
                        Нету проектов для создания программ
                      </span>
                      <button
                        onClick={() => goToCreateProject()}
                        className={classes.createProgramm}
                      >
                        <img
                          src={iconAddProjectBlue}
                          alt="iconAddProjectBlue"
                        />
                      </button>
                    </div>
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
