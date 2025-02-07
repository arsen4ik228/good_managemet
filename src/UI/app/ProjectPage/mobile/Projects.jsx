import React, { useEffect, useState, useRef } from "react"
import classes from "./Projects.module.css"
import Target from "./Targets/Target"
import { useGetProjectIdQuery, useGetProjectNewQuery, useUpdateProjectMutation } from "@services"
import { useNavigate, useParams } from "react-router-dom"
import deleteIcon from '../Custom//icon/icon _ delete.svg'
import Header from "../Custom/Header/Header"
import HandlerMutation from "../../../../mobile/UI/Custom/HandlerMutation"
import { resizeTextarea, transformArraiesForRequset } from "@helpers/helpers"
import editIcon from '../Custom/icon/icon _ edit.svg'
import listSetting from '../Custom/icon/icon _ list setting.svg'
import CustomSelectSettingModal from "./CustomSelectSettingModal/CustomSelectSettingModal"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"


export default function NewProject() {
  const { projectId } = useParams();
  const uniqueIdRef = useRef(0);
  const navigate = useNavigate()

  const [edit, setEdit] = useState(false)
  const [dummyKey, setDummyKey] = useState(0)
  const [isRemoveProject, setIsRemoveProject] = useState(false)
  const [selectedSections, setSelectedSections] = useState([])
  const [openSelectSettingModal, setOpenSelectSettingModal] = useState(false)
  const [isArchive, setIsArchive] = useState(false)


  const [projectName, setProjectName] = useState('')
  const [selectedOrg, setSelectedOrg] = useState()
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [filtredPrograms, setFilterPrograms] = useState([])
  const [filtredStrategies, setFilterStrategies] = useState([])

  const [descriptionProject, setDescriptionProject] = useState('')
  const [productsArray, setProductsArray] = useState([])
  const [eventArray, setEventArray] = useState([])
  const [rulesArray, setRulesArray] = useState([])
  const [simpleArray, setSimpleArray] = useState([])
  const [statisticsArray, setStatisticsArray] = useState([])

  const [productsList, setProductsList] = useState([])
  const [eventList, setEventList] = useState([])
  const [rulesList, setRulesList] = useState([])
  const [simpleList, setSimpleList] = useState([])
  const [statisticsList, setStatisticsList] = useState([])

  const [selectedWorker, setSelectedWorker] = useState(null)
  const [targetState, setTargetState] = useState('')
  const [deadlineDate, setDeadlineDate] = useState(null)
  const [targetIndex, setTargetIndex] = useState()
  const [targetContent, setTargetContent] = useState('')
  const [targetType, setTargetType] = useState('')

  const TARGET_TYPES = {
    'Правила': 'rules',
    'Продукт': 'products',
    'Статистика': 'statistics',
    'Обычная': 'simple',
    'Организационные мероприятия': 'event',
    'ПравилаNEW': 'rulesNEW',
    'ПродуктNEW': 'productsNEW',
    'СтатистикаNEW': 'statisticsNEW',
    'ОбычнаяNEW': 'simpleNEW',
    'Организационные мероприятияNEW': 'eventNEW',
  };

  const SWITCH_TYPE = {
    'Правила': 'Правила',
    'Продукт': 'Продукт',
    'Статистика': 'Статистика',
    'Обычная': 'Обычная',
    'Организационные мероприятия': 'Организационные мероприятия',
    'ПравилаNEW': 'Правила',
    'ПродуктNEW': 'Продукт',
    'СтатистикаNEW': 'Статистика',
    'ОбычнаяNEW': 'Обычная',
    'Организационные мероприятияNEW': 'Организационные мероприятия',
  }

  const ADD_TARGET = {
    rules: { array: rulesArray, setFunction: setRulesArray },
    products: { array: productsArray, setFunction: setProductsArray },
    statistics: { array: statisticsArray, setFunction: setStatisticsArray },
    simple: { array: simpleArray, setFunction: setSimpleArray },
    event: { array: eventArray, setFunction: setEventArray },
    rulesNEW: { array: rulesList, setFunction: setRulesList },
    productsNEW: { array: productsList, setFunction: setProductsList },
    statisticsNEW: { array: statisticsList, setFunction: setStatisticsList },
    simpleNEW: { array: simpleList, setFunction: setSimpleList },
    eventNEW: { array: eventList, setFunction: setEventList },
  };

  const {
    currentProject = [],
    targets = [],
  } = useGetProjectIdQuery({ projectId }, {
    selectFromResult: ({ data }) => ({
      currentProject: data?.currentProject,
      targets: data?.targets,
    })
  })
  console.log(currentProject)
  const {
    programs = [],
    strategies = [],
    workers = []
  } = useGetProjectNewQuery(undefined, {
    selectFromResult: ({ data }) => ({
      organizations: data?.organizations,
      programs: data?.programs,
      strategies: data?.strategies,
      workers: data?.workers,
    }),
  });

  const [
    updateProject, {
      isLoading: isLoadingUpdateProjectMutation,
      isSuccess: isSuccessUpdateProjectMutation,
      isError: isErrorUpdateProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation()



  useEffect(() => {
    if (isSuccessUpdateProjectMutation) {
      setTimeout(window.location.reload(), 1000)
    }
  }, [isSuccessUpdateProjectMutation])

  useEffect(() => { // фильтр Стратегий по организации
    if (strategies.length > 0) {
      const filter = strategies.filter(strategy => strategy?.organization?.id === selectedOrg)
      setFilterStrategies(filter)
      // setSelectedStrategy('')
    }
  }, [strategies, selectedOrg])

  useEffect(() => { // фильтр Программ по организации
    if (programs.length > 0) {
      const filtredPrograms = programs.filter(program => program?.organization?.id === selectedOrg)
      setFilterPrograms(filtredPrograms)
      // setSelectedProgram('')
    }
  }, [programs, selectedOrg])

  // useEffect(() => { // формирование массивов на основе targets
  //   if (targets.length > 0) {
  //     targets.forEach((item) => {
  //       switch (item.type) {
  //         case 'Продукт':
  //           setProductsArray((prevState) => ([...prevState, { ...item, holderUserIdchange: item.holderUserId }]))
  //           if (item.targetState === 'Завершена')
  //             setIsArchive(true)
  //           break;
  //         case 'Правила':
  //           setRulesArray((prevState) => ([...prevState, { ...item, holderUserIdchange: item.holderUserId }]))
  //           setSelectedSections((prevState) => ([...prevState, 'Правила']))
  //           break;
  //         case 'Организационные мероприятия':
  //           setEventArray((prevState) => ([...prevState, { ...item, holderUserIdchange: item.holderUserId }]))
  //           setSelectedSections((prevState) => ([...prevState, 'Организационные мероприятия']))
  //           break;
  //         case 'Обычная':
  //           setSimpleArray((prevState) => ([...prevState, { ...item, holderUserIdchange: item.holderUserId }]))
  //           break;
  //         case 'Статистика':
  //           setStatisticsArray((prevState) => ([...prevState, { ...item, holderUserIdchange: item.holderUserId }]))
  //           setSelectedSections((prevState) => ([...prevState, 'Метрика']))
  //           break;
  //         default:
  //           break
  //       }
  //     })
  //   }
  // }, [targets])

  useEffect(() => { // формирование массивов на основе targets
    if (targets.length > 0) {
      const sortedTargets = targets?.map(item => item).sort((a, b) => a.orderNumber - b.orderNumber)

      const product = sortedTargets.find(item => item.type === 'Продукт')

      const rulesArray = sortedTargets.filter(item => item.type === 'Правила')
        .map(item => ({ ...item, orderNumber: item.orderNumber || 1 }))

      const eventArray = sortedTargets.filter(item => item.type === 'Организационные мероприятия')
        .map(item => ({ ...item, orderNumber: item.orderNumber || 1 }))

      const statisticsArray = sortedTargets.filter(item => item.type === 'Статистика')
        .map(item => ({ ...item, orderNumber: item.orderNumber || 1 }))

      const simpleArray = sortedTargets.filter(item => item.type === 'Обычная')
        .map(item => ({ ...item, orderNumber: item.orderNumber || 1 }))


      setProductsArray(prevState => [...prevState, product])
      if (product.targetState === 'Завершена')
        setIsArchive(true)

      if (rulesArray.length > 0) {
        setRulesArray(prevState => [...prevState, ...rulesArray])
        setSelectedSections(prevState => [...prevState, 'Правила'])
      }
      if (statisticsArray.length > 0) {
        setStatisticsArray(prevState => [...prevState, ...statisticsArray])
        setSelectedSections(prevState => [...prevState, 'Метрика'])
      }
      if (eventArray.length > 0) {
        setEventArray(prevState => [...prevState, ...eventArray])
        setSelectedSections(prevState => [...prevState, 'Организационные мероприятия'])
      }
      setSimpleArray(prevState => [...prevState, ...simpleArray])
    }
  }, [targets])

  console.log('массивчики   ', productsArray, eventArray, rulesArray, simpleArray, statisticsArray)

  useEffect(() => { // предустановка значений при загрузке страницы
    if (currentProject.projectName)
      setProjectName(currentProject.projectName)

    if (currentProject?.organization?.id)
      setSelectedOrg(currentProject?.organization.id)

    if (currentProject?.programId)
      setSelectedProgram(currentProject.programId)

    if (currentProject?.strategy?.id)
      setSelectedStrategy(currentProject.strategy.id)

    if (currentProject?.content) {
      setDescriptionProject(currentProject?.content)
      setSelectedSections((prevState) => ([...prevState, 'Описание']))
    }
  }, [currentProject])


  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      if (targetIndex < array.length) {
        const updatedArray = [...array];
        const updatedItem = { ...updatedArray[targetIndex], content: targetContent };
        updatedArray[targetIndex] = updatedItem;
        setFunction(updatedArray);
      }
    }
  }, [targetContent]);

  useEffect(() => {
    if (targetType && deadlineDate !== null) {
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], deadline: deadlineDate }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
      setDeadlineDate(null)
    }
  }, [deadlineDate])

  useEffect(() => {
    if (targetType && selectedWorker !== null) {
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], holderUserId: selectedWorker }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
      setSelectedWorker(null)
    }
  }, [selectedWorker])

  useEffect(() => {
    resizeTextarea('1')
  }, [descriptionProject])

  useEffect(() => {
    console.log(targetType)
    if (targetType && targetState !== null) {
      console.warn('targetState useEffect')
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], targetState: targetState }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
      setTargetState(null)
    }
  }, [targetState])

  const targetFormation = (index, type) => {
    setTargetIndex(index)
    setTargetType(TARGET_TYPES[type])
  }

  const deleteTarget = (array) => {
    if (array && Array.isArray(array)) {
      array.pop();
    }
    setDummyKey((prevState) => prevState + 1)
  }

  const addTarget = (type) => {
    console.log('click')
    if (edit) {
      setTargetType(null)
      const targetType = TARGET_TYPES[type]
      const { setFunction } = ADD_TARGET[targetType]

      // const newIndex = array.length + 1;
      const newIndex = ++uniqueIdRef.current
      const newTarget = {
        // id: new Date(),
        type: SWITCH_TYPE[type],
        orderNumber: newIndex,
        content: '',
        holderUserId: '',
        deadline: ''
      };
      setTargetIndex(newIndex);
      setFunction(prevState => [...prevState, newTarget]);
    }
    // setTargetIndex(newIndex);
  }

  const setProgaramForProject = (value) => {
    setSelectedProgram(value)
    const currentStrategy = programs?.find(program => program.id === value)
    console.log(currentStrategy)
    if (currentStrategy)
      setSelectedStrategy(currentStrategy.strategy.id)
    else
      setSelectedStrategy('')
  }


  const handleOnDragEnd = (result, array, setArray) => {
    const { destination, source } = result;

    if (!destination) return

    const items = Array.from(array);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    console.warn('items:   ', items)
    setArray(items)
  };

  useEffect(() => {
    console.log('Updated rulesList:', rulesList);
  }, [rulesList]);


  // const _handleOnDragEnd = (result) => {
  //   const { source, destination } = result;

  //   if (!destination) {
  //     return;
  //   }
  //   const items = Array.from(_array);
  //   const [reorderedItem] = items.splice(source.index, 1);
  //   items.splice(destination.index, 0, reorderedItem);

  //   _setArray(items);
  // };
  
  const saveProject = async () => {

    const updatedProducts = transformArraiesForRequset(productsArray)
    const updatedRules = transformArraiesForRequset(rulesArray)
    const updatedEvent = transformArraiesForRequset(eventArray)
    const updatedStatistics = transformArraiesForRequset(statisticsArray)
    const updatedSimple = transformArraiesForRequset(simpleArray)

    const Data = {}

    if (!edit) {
      Data.targetUpdateDtos = [
        ...updatedSimple,
        ...updatedProducts,
        ...updatedEvent,
        ...updatedRules,
        ...updatedStatistics
      ]
    }
    else {
      if ((projectName !== currentProject.projectName) && projectName) {
        Data.projectName = projectName
      }
      // if ((selectedOrg !== currentProject?.organization?.id) && selectedOrg) {
      //   Data.organizationId = selectedOrg
      // }
      if ((selectedProgram !== currentProject?.programId) && selectedProgram !== null) {
        Data.programId = selectedProgram
      }
      if ((selectedStrategy !== currentProject?.strategy?.id) && selectedStrategy !== null) {
        Data.strategyId = selectedStrategy
      }
      if ((descriptionProject !== currentProject?.content) && descriptionProject) {
        Data.content = descriptionProject
      }
      if (
        rulesList.length > 0 ||
        productsList.length > 0 ||
        statisticsList.length > 0 ||
        simpleList.length > 0 ||
        eventList.length > 0
      ) {
        Data.targetCreateDtos = [
          ...rulesList.map((item, index) => ({ ...item, orderNumber: rulesArray.length + index + 1 })),
          ...productsList.map((item, index) => ({ ...item, orderNumber: productsArray.length + index + 1 })),
          ...statisticsList.map((item, index) => ({ ...item, orderNumber: statisticsArray.length + index + 1 })),
          ...simpleList.map((item, index) => ({ ...item, orderNumber: simpleArray.length + index + 1 })),
          ...eventList.map((item, index) => ({ ...item, orderNumber: eventArray.length + index + 1 })),
        ];
      }

      Data.targetUpdateDtos = [
        ...updatedSimple,
        ...updatedProducts,
        ...updatedEvent,
        ...updatedRules,
        ...updatedStatistics
      ]
    }

    console.log(Data)
    await updateProject({
      projectId,
      _id: projectId,
      type: 'Проект',
      ...Data,
    })
      .unwrap()
      .then(() => {
        isRemoveProject && navigate(-1)
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  }
  // console.log(currentProject)
  return (
    <>
      <div className={classes.wrapper}>
        <>
          <div className={classes.header}>
            <Header create={false} title={'Редактировать проект'}></Header>
            <div className={classes.saveIcon}>
              {!isArchive && (
                <img
                  src={listSetting}
                  alt="listSetting"
                  onClick={() => setOpenSelectSettingModal(true)}
                />
              )}
            </div>
          </div>
        </>
        <div className={classes.body}>
          <>
            <div className={classes.selectedType}>
              {edit ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                />
              ) : (
                <>
                  {currentProject.projectName}
                </>
              )}
              {!isArchive && (
                <img
                  src={editIcon}
                  alt="edit"
                  onClick={() => setEdit(!edit)}
                />
              )}
            </div>

            <div
              className={classes.bodyContainer}
            >
              <div className={classes.name}>Организация</div>
              {/* {edit ? (
                <div className={classes.selectSection}>
                  <select name="selectOrg" value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} >
                    {organizations.map((item, index) => (
                      <>
                        <option key={index} value={item.id}>{item.organizationName}</option>
                      </>
                    ))}
                  </select>
                </div>
              ) : ( */}
              <div className={classes.title}>
                {currentProject?.organization?.organizationName}
              </div>
              {/* )} */}
            </div>
            {(edit || currentProject.programId) &&
              (
                <div
                  className={classes.bodyContainer}
                >
                  <div className={classes.name}>Программа</div>
                  {edit ? (
                    <div className={classes.selectSection}>
                      <select name="selectProgram" value={selectedProgram} onChange={(e) => setProgaramForProject(e.target.value)}>
                        <option value={null}>-</option>
                        {filtredPrograms.map((item, index) => (
                          <option key={index} value={item.id}>{item.projectName}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className={classes.title}>
                      Программа №{currentProject?.programNumber}
                    </div>
                  )}
                </div>
              )}

            {(edit || currentProject?.strategy?.id) && (
              <div
                className={classes.bodyContainer}
              >
                <div className={classes.name}>Стратегия</div>
                {edit ? (
                  <div className={classes.selectSection}>
                    <select name="selectProgram" value={selectedStrategy} onChange={(e) => setSelectedStrategy(e.target.value)}>
                      <option value={null}>-</option>
                      {filtredStrategies.map((item, index) => (
                        <option value={item.id}> Стратегия №{item.strategyNumber}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className={classes.title}>
                    Стратегия №{currentProject?.strategy?.strategyNumber}
                  </div>
                )}
              </div>
            )}
          </>
          <>
            <div className={classes.targetsContainer}>

              {(selectedSections.includes('Описание')) && (
                <>
                  <div className={classes.sectionName}>Описание</div>
                  <div className={classes.targetsFlex}>
                    <div className={classes.descriptionFlex}>
                      <div className={classes.descriptionContainer}>
                        <textarea
                          name="description"
                          id="1"
                          disabled={!edit}
                          placeholder="Введите описание проекта..."
                          value={descriptionProject}
                          onChange={(e) => {
                            setDescriptionProject(e.target.value)
                            setTimeout(resizeTextarea('1'), 0)
                          }}
                        >
                        </textarea>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(productsArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName}  >Продукт</div>
                  <div className={classes.targetsFlex}>
                    {/* {productsArray.filter(item => item.targetState !== 'Отменена').map((item, index) => ( */}
                    {productsArray.map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Продукт')}>
                        <Target
                          id={item.id}
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          targetsList={targets}
                          selectedWorker={selectedWorker}
                          deadlineDate={deadlineDate}
                          setTargetState={setTargetState}
                          requestFunc={setIsRemoveProject}
                        >
                        </Target>
                      </div>
                    ))}
                    {/* {edit &&
                      (
                        <>
                          {productsList.map((item, index) => (
                            <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'ПродуктNEW')}>
                              <Target
                                item={item}
                                isNew={true}
                                contentSender={setTargetContent}
                                workersList={workers}
                                setSelectedWorker={setSelectedWorker}
                                setDeadlineDate={setDeadlineDate}
                              >
                              </Target>
                            </div>
                          ))}
                          {productsList.length > 0 && (
                            <div className={classes.deleteContainer} onClick={() => deleteTarget(productsList)}>
                              Удалить
                              <img src={deleteIcon} alt="delete" />
                            </div>
                          )}
                        </>
                      )} */}
                  </div>
                </>
              )}
              {selectedSections.includes('Организационные мероприятия') && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('Организационные мероприятияNEW')}>Организационные мероприятия</div>
                  <div className={classes.targetsFlex}>
                    {/* {eventArray.filter(item => item.targetState !== 'Отменена').map((item, index) => ( */}
                    {eventArray.map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Организационные мероприятия')}>
                        <Target
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          setTargetState={setTargetState}
                          targetsList={targets}
                          isArchive={isArchive}
                        >
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, eventList, setEventList)}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <>
                                {eventList.map((item, index) => (
                                  <Draggable
                                    key={item.orderNumber}
                                    draggableId={`item-${item.orderNumber}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        key={item.orderNumber}
                                        className={classes.targetContainer}
                                        onClick={() => targetFormation(index, 'Организационные мероприятияNEW')}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Target
                                          item={item}
                                          isNew={true}
                                          contentSender={setTargetContent}
                                          workersList={workers}
                                          setSelectedWorker={setSelectedWorker}
                                          setDeadlineDate={setDeadlineDate}
                                        >

                                        </Target>
                                      </div>

                                    )}
                                  </Draggable>
                                ))}
                                {eventList.length > 0 && (
                                  <div className={classes.deleteContainer} onClick={() => deleteTarget(eventList)}>
                                    Удалить
                                    <img src={deleteIcon} alt="delete" />
                                  </div>
                                )}
                              </>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}


                  </div>
                </>
              )}

              {selectedSections.includes('Правила') && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('ПравилаNEW')}>Правила</div>
                  <div className={classes.targetsFlex}>
                    {rulesArray.filter(item => item.targetState !== 'Отменена').map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Правила')}>
                        <Target
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          setTargetState={setTargetState}
                          targetsList={targets}
                          isArchive={isArchive}
                        >
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, rulesList, setRulesList)}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <>
                                {rulesList.map((item, index) => (
                                  <Draggable
                                    key={item.orderNumber}
                                    draggableId={`item-${item.orderNumber}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        key={item.orderNumber}
                                        className={classes.targetContainer}
                                        onClick={() => targetFormation(index, 'ПравилаNEW')}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Target
                                          item={item}
                                          isNew={true}
                                          contentSender={setTargetContent}
                                          workersList={workers}
                                          setSelectedWorker={setSelectedWorker}
                                          setDeadlineDate={setDeadlineDate}
                                        >
                                        </Target>
                                      </div>

                                    )}
                                  </Draggable>
                                ))}
                                {rulesList.length > 0 && (
                                  <div className={classes.deleteContainer} onClick={() => deleteTarget(rulesList)}>
                                    Удалить
                                    <img src={deleteIcon} alt="delete" />
                                  </div>
                                )}
                              </>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </div>
                </>

              )}


              {(simpleArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('ОбычнаяNEW')}>Задачи</div>
                  <div className={classes.targetsFlex}>
                    {simpleArray.map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Обычная')}>
                        <Target
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          setTargetState={setTargetState}
                          targetsList={targets}
                          isArchive={isArchive}
                        >
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, simpleList, setSimpleList)}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <>
                                {simpleList.map((item, index) => (
                                  <Draggable
                                    key={item.orderNumber}
                                    draggableId={`item-${item.orderNumber}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        key={item.orderNumber}
                                        className={classes.targetContainer}
                                        onClick={() => targetFormation(index, 'ОбычнаяNEW')}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Target
                                          item={item}
                                          isNew={true}
                                          contentSender={setTargetContent}
                                          workersList={workers}
                                          setSelectedWorker={setSelectedWorker}
                                          setDeadlineDate={setDeadlineDate}
                                        >

                                        </Target>
                                      </div>

                                    )}
                                  </Draggable>
                                ))}
                                {simpleList.length > 0 && (
                                  <div className={classes.deleteContainer} onClick={() => deleteTarget(simpleList)}>
                                    Удалить
                                    <img src={deleteIcon} alt="delete" />
                                  </div>
                                )}
                              </>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}


                  </div>
                </>
              )}


              {selectedSections.includes('Метрика') && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('СтатистикаNEW')}> Метрика</div>
                  <div className={classes.targetsFlex}>
                    {statisticsArray.filter(item => item.targetState !== 'Отменена').filter(item => item.targetState !== 'Отменена').map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Статистика')}>
                        <Target
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          setTargetState={setTargetState}
                          targetsList={targets}
                          isArchive={isArchive}
                        >
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, statisticsList, setStatisticsList)}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <>
                                {statisticsList.map((item, index) => (
                                  <Draggable
                                    key={item.orderNumber}
                                    draggableId={`item-${item.orderNumber}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        key={item.orderNumber}
                                        className={classes.targetContainer}
                                        onClick={() => targetFormation(index, 'СтатистикаNEW')}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Target
                                          item={item}
                                          isNew={true}
                                          contentSender={setTargetContent}
                                          workersList={workers}
                                          setSelectedWorker={setSelectedWorker}
                                          setDeadlineDate={setDeadlineDate}
                                        >

                                        </Target>
                                      </div>

                                    )}
                                  </Draggable>
                                ))}
                                {statisticsList.length > 0 && (
                                  <div className={classes.deleteContainer} onClick={() => deleteTarget(statisticsList)}>
                                    Удалить
                                    <img src={deleteIcon} alt="delete" />
                                  </div>
                                )}
                              </>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </div>
                </>
              )}
            </div>
          </>

        </div>


        <>
          <footer className={classes.inputContainer}>
            <div className={classes.inputRow2}>
              <div>
                <button
                  disabled={isArchive}
                  style={{ 'backgroundColor': isArchive ? 'grey' : '' }}
                  onClick={() => saveProject()}
                >
                  СОХРАНИТЬ
                </button>
              </div>

            </div>
          </footer>
        </>

      </div>

      {openSelectSettingModal && (
        <CustomSelectSettingModal
          setModalOpen={setOpenSelectSettingModal}
          listSelectedSections={selectedSections}
          setListSelectedSections={setSelectedSections}
        ></CustomSelectSettingModal>
      )}

      <HandlerMutation
        Loading={isLoadingUpdateProjectMutation}
        Error={isErrorUpdateProjectMutation}
        Success={isSuccessUpdateProjectMutation}
        textSuccess={"Проект успешно обновлён."}
        textError={
          Error?.data?.errors?.[0]?.errors?.[0]
            ? Error.data.errors[0].errors[0]
            : Error?.data?.message
        }
      ></HandlerMutation>
    </>
  );
}
