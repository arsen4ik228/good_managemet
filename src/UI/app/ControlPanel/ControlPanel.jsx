import React, {useState, useEffect, useCallback, useRef} from "react";

import classes from "./ControlPanel.module.css";
import Header from "@Custom/Header/Header";


import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useControlPanel, useModuleActions} from "@hooks";
import {ModalSelectRadio} from "@Custom/modalSelectRadio/ModalSelectRadio";
import {useModalSelectRadio} from "@hooks";
import HandlerMutation from "@Custom/HandlerMutation.jsx";
import PanelDragDrop from "./panelDragDrop/PanelDragDrop";
import SortableCard from "./GraphicStatistics/card/sortable/SortableCard";
import ModalStatistic from "./GraphicStatistics/modal/ModalStatistic";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
    saveToIndexedDB,
    deleteFromIndexedDB,
    loadFromIndexedDB,
} from "@utils/src/index.js";
import usePanelToStatisticsHook from "@hooks/usePanelToStatisticsHook";
import {debounce} from "lodash";

import {Button} from "antd";
import {PlusCircleOutlined} from '@ant-design/icons';
import {useGetAllStatisticsInControlPanel} from "@hooks";
import {useGetPostsUserByOrganization} from "../../../hooks/Post/useGetPostsUserByOrganization";
import {useAllStatistics} from "@hooks/Statistics/useAllStatistics";

export default function ControlPanel() {
    const [datePoint, setDatePoint] = useState(null);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalGraphic, setOpenModalGraphic] = useState(false);

    const [selectedControlPanelId, setSelectedControlPanelId] = useState(null);
    const [arrayAllControlPanel, setArrayAllControlPanel] = useState([]);

    const [selectedStatistic, setSelectedStatistic] = useState({
        id: null,
        name: "",
        chartDirection: "Прямая"
    });

    const [cards, setCards] = useState([]);

    const [showLineNorma, setShowLineNorma] = useState(false);

    const {
        statistics,
    } = useAllStatistics({
        statisticData: false,
    });

    const {isCreate} = useModuleActions("control_panel");

    const {
        reduxSelectedOrganizationId,

        // Получение всех панелей по организации
        allControlPanel,
        isLoadingGetAllControlPanel,
        isFetchingGetAllControlPanel,
        isErrorGetAllControlPanel,

        // Создание панели
        postControlPanel,
        isLoadingPostControlPanelMutation,
        isSuccessPostControlPanelMutation,
        isErrorPostControlPanelMutation,
        ErrorPostControlPanel,
        localIsResponsePostControlPanelMutation,

        //  Обновление
        updateControlPanel,
        isLoadingUpdateControlPanelMutation,
        isSuccessUpdateControlPanelMutation,
        isErrorUpdateControlPanelMutation,
        ErrorUpdateControlPanel,
        localIsResponseUpdateControlPanelMutation,

        // Удаление статистики
        deleteControlPanel,
        isLoadingDeleteControlPanelMutation,
        isSuccessDeleteControlPanelMutation,
        isErrorDeleteControlPanelMutation,
        ErrorDeleteControlPanel,
        localIsResponseDeleteControlPanelMutation,
    } = useControlPanel();

    const {
        allStatistics,
    } = useGetAllStatisticsInControlPanel({
        selectedControlPanelId,
        datePoint,
        statisticData: true
    });

    const {
        userPosts,
    } = useGetPostsUserByOrganization();

    const {
        selectedID: selectedPostIdForCreated,
        selectedName,

        handleRadioChange,
        handleInputChangeModalSearch,

        filterArraySearchModal,
        inputSearchModal,
    } = useModalSelectRadio({array: userPosts, arrayItem: "postName"});

    const calculateInitialDate = () => {
        const currentDate = localStorage.getItem("reportDay");
        if (currentDate !== null) {
            const targetDay = parseInt(currentDate, 10);
            const today = new Date();
            const todayDay = today.getDay();

            let diff = todayDay - targetDay;
            if (diff < 0) diff += 7;

            const lastTargetDate = new Date(today);
            lastTargetDate.setDate(today.getDate() - diff);

            return lastTargetDate.toISOString().split("T")[0];
        }
        return datePoint;
    };

    const getControlPanelId = (id) => {
        saveToIndexedDB(
            reduxSelectedOrganizationId,
            arrayAllControlPanel.map(({id, orderNumber, panelName}) => ({
                id,
                orderNumber,
                panelName,
            })),
            id
        );
        setSelectedControlPanelId(id);
    };

    const openCreate = () => {
        setOpenModalCreate(true);
    };
    const createControlPanel = async () => {
        await postControlPanel({
            orderNumber: allControlPanel.length == 0 ? 1 : allControlPanel.length + 1,
            panelName: `${selectedName} №`,
            organizationId: reduxSelectedOrganizationId,
            postId: selectedPostIdForCreated,
        })
            .unwrap()
            .then(() => {
                setOpenModalCreate(false);
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    };


    const onDragEnd_ControlPanel = async (result) => {
        const {source, destination} = result;

        // Если элемент не перемещен в допустимую область, ничего не делаем
        if (!destination) {
            return;
        }

        // Создаем новый массив состояний
        const updatedState = Array.from(arrayAllControlPanel);

        // Перемещаем элемент
        const [movedItem] = updatedState.splice(source.index, 1);
        updatedState.splice(destination.index, 0, movedItem);

        // Обновляем порядковые номера
        const updatedArray = updatedState.map((item, index) => ({
            ...item,
            orderNumber: index + 1,
        }));

        // Обновляем состояние
        setArrayAllControlPanel(updatedArray);

        try {
            // Сохраняем массив в IndexedDB
            await saveToIndexedDB(
                reduxSelectedOrganizationId,
                updatedArray.map(({id, orderNumber, panelName}) => ({
                    id,
                    orderNumber,
                    panelName,
                }))
            );

            //("Данные успешно сохранены в IndexedDB");
        } catch (error) {
            console.error("Ошибка при сохранении данных в IndexedDB:", error);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const {
        updatePanelToStatisticsUpdateOrderNumbers,
    } = usePanelToStatisticsHook();

    const debouncedUpdate = useCallback(
        debounce((updatedStatistics) => {
            updatePanelToStatisticsUpdateOrderNumbers(updatedStatistics);
        }, 1000),
        []
    );

    const handleDragEnd_CardStatstic = (event) => {
        const {active, over} = event;

        // Если нет активного или целевого элемента, выходим
        if (!active || !over) {
            return;
        }

        // Если элементы совпадают, ничего не делаем
        if (active.id === over.id) {
            return;
        }

        setCards((items) => {
            // Проверяем, что массив существует и не содержит null
            if (!items || items.some((item) => !item || !item.id)) {
                return items;
            }

            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            // Если индексы не найдены, возвращаем исходный массив
            if (oldIndex === -1 || newIndex === -1) {
                return items;
            }

            const newItems = arrayMove(items, oldIndex, newIndex);

            const updatedStatistics = newItems.map((item, index) => ({
                _id: item.panelToStatisticsId,
                orderStatisticNumber: index + 1,
            }));

            debouncedUpdate(updatedStatistics);

            return newItems;
        });
    };

    useEffect(() => {
        if (Object.keys(allControlPanel).length > 0) {
            loadFromIndexedDB(reduxSelectedOrganizationId, (data) => {
                if (data.length > 0) {
                    setArrayAllControlPanel(() => {
                        return allControlPanel
                            .map((panel) => {
                                const matchingData = data.find((item) => item.id === panel.id);
                                //("matchingData", matchingData);
                                if (matchingData) {
                                    if (matchingData.isActive) {
                                        setSelectedControlPanelId(matchingData.id);
                                    }
                                    return {
                                        ...panel,
                                        orderNumber: matchingData.orderNumber,
                                        isActive: matchingData.isActive,
                                    };
                                }
                                return panel;
                            })
                            .sort((a, b) => a.orderNumber - b.orderNumber);
                    });
                } else {
                    setArrayAllControlPanel(allControlPanel);
                }
            });
        } else {
            setArrayAllControlPanel(allControlPanel);
        }

    }, [allControlPanel, isLoadingGetAllControlPanel,
        isFetchingGetAllControlPanel,
        isErrorGetAllControlPanel,
    ]);

    // Сброс cards при изменении reduxSelectedOrganizationId
    useEffect(() => {
        setCards([]);
    }, [reduxSelectedOrganizationId]);

    // Обновление cards при изменении statisticsPoints
    useEffect(() => {
        if (!selectedControlPanelId) return;

        if (allStatistics.length > 0) {
            setCards(allStatistics);
        } else {
            setCards([]);
        }
    }, [allStatistics]);


    useEffect(() => {
        setDatePoint(() => {
            return calculateInitialDate();
        });
    }, []);

    return (
        <div className={classes.dialog}>
            <Header
                name={"панель управления"}
            >
                <DragDropContext onDragEnd={onDragEnd_ControlPanel}>
                    <Droppable droppableId="panelList" direction="horizontal">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={classes.droppableContainer}
                            >
                                {
                                    isCreate &&
                                    <Button color="default" variant="outlined" onClick={openCreate}>
                                        Добавить <PlusCircleOutlined/>
                                    </Button>
                                }

                                {arrayAllControlPanel?.map((item, index) => (
                                    <Draggable
                                        key={item?.id}
                                        draggableId={String(item?.id)}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >

                                                <PanelDragDrop
                                                    provided={provided}
                                                    statistics={statistics}
                                                    datePoint={datePoint}
                                                    updateControlPanel={updateControlPanel}
                                                    panel={item}
                                                    deleteFromIndexedDB={deleteFromIndexedDB}
                                                    deleteControlPanel={deleteControlPanel}
                                                    reduxSelectedOrganizationId={reduxSelectedOrganizationId}
                                                    id={item.id}
                                                    isActive={selectedControlPanelId === item?.id}

                                                    name={
                                                        item?.isNameChanged
                                                            ? item?.panelName
                                                            : `${item?.panelName} ${item?.controlPanelNumber}`
                                                    }
                                                    onClick={() => getControlPanelId(item?.id)}
                                                ></PanelDragDrop>

                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                <Button
                                    onClick={() => setShowLineNorma(!showLineNorma)}
                                    style={{
                                        backgroundColor:
                                            showLineNorma ? "rgba(207, 222, 229, 0.5)" : "#fff",
                                        color: showLineNorma ? "#005475" : "#999999",
                                        border: "1px solid #CFDEE5",
                                        borderRadius: "6px",
                                        fontWeight: 400,
                                    }}>
                                    Отображать нормы
                                </Button>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Header>

            <div className={classes.main}>
                {cards.length > 0 && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd_CardStatstic}
                    >
                        <SortableContext items={cards} strategy={rectSortingStrategy}>
                            <div className={classes.graphics}>
                                {cards.map((item) => (
                                    <SortableCard
                                        key={item.id}
                                        id={item.id}
                                        item={item}
                                        datePoint={datePoint}
                                        setOpenModal={setOpenModalGraphic}
                                        setSelectedStatistic={setSelectedStatistic}
                                        norma={showLineNorma ? item.normalize : null}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                {openModalCreate && (
                    <ModalSelectRadio
                        nameTable={"Название поста"}
                        handleSearchValue={inputSearchModal}
                        handleSearchOnChange={handleInputChangeModalSearch}
                        handleRadioChange={handleRadioChange}
                        exit={() => {
                            setOpenModalCreate(false);
                        }}
                        filterArray={filterArraySearchModal}
                        array={userPosts}
                        arrayItem={"postName"}
                        selectedItemID={selectedPostIdForCreated}
                        save={createControlPanel}
                    ></ModalSelectRadio>
                )}
                {openModalGraphic && (
                    <ModalStatistic
                        selectedStatistic={selectedStatistic}
                        openModal={openModalGraphic}
                        setOpenModal={setOpenModalGraphic}
                    ></ModalStatistic>
                )}

                <div className={classes.handler}>
                    <HandlerMutation
                        Loading={isLoadingPostControlPanelMutation}
                        Error={
                            isErrorPostControlPanelMutation &&
                            localIsResponsePostControlPanelMutation
                        }
                        Success={
                            isSuccessPostControlPanelMutation &&
                            localIsResponsePostControlPanelMutation
                        }
                        textSuccess={`Панель управления успешно создана.`}
                        textError={
                            ErrorPostControlPanel?.data?.errors?.[0]?.errors?.[0]
                                ? ErrorPostControlPanel.data.errors[0].errors[0]
                                : ErrorPostControlPanel?.data?.message
                        }
                    ></HandlerMutation>

                    <HandlerMutation
                        Loading={isLoadingUpdateControlPanelMutation}
                        Error={
                            isErrorUpdateControlPanelMutation &&
                            localIsResponseUpdateControlPanelMutation
                        }
                        Success={
                            isSuccessUpdateControlPanelMutation &&
                            localIsResponseUpdateControlPanelMutation
                        }
                        textSuccess={`Панель управления обновлена.`}
                        textError={
                            ErrorUpdateControlPanel?.data?.errors?.[0]?.errors?.[0]
                                ? ErrorUpdateControlPanel.data.errors[0].errors[0]
                                : ErrorUpdateControlPanel?.data?.message
                        }
                    ></HandlerMutation>

                    <HandlerMutation
                        Loading={isLoadingDeleteControlPanelMutation}
                        Error={
                            isErrorDeleteControlPanelMutation &&
                            localIsResponseDeleteControlPanelMutation
                        }
                        Success={
                            isSuccessDeleteControlPanelMutation &&
                            localIsResponseDeleteControlPanelMutation
                        }
                        textSuccess={"Панель управления удалена"}
                        textError={
                            ErrorDeleteControlPanel?.data?.errors?.[0]?.errors?.[0]
                                ? ErrorDeleteControlPanel.data.errors[0].errors[0]
                                : ErrorDeleteControlPanel?.data?.message
                        }
                    ></HandlerMutation>
                </div>
            </div>
        </div>
    );
}
