import React, { useState, useEffect, useCallback } from "react";
import classes from "./ControlPanel.module.css";
import Header from "../Custom/CustomHeader/Header";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ModalSetting from "./modalSetting/ModalSetting";
import { ModalSelectRadio } from "./modalSelectRadio/ModalSelectRadio";

import ModalStatistic from "./GraphicStatistics/modal/ModalStatistic";
import SortableCard from "./GraphicStatistics/card/sortable/SortableCard";
import PanelDragDrop from "./panelDragDrop/PanelDragDrop";

import { useModalSelectRadio } from "@hooks";
import {useControlPanel} from "@hooks";
import { usePostsHook } from "@hooks";

import ModalContainer from "../Custom/ModalContainer/ModalContainer";

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
import {usePanelToStatisticsHook} from "@hooks";
import { debounce } from "lodash";

export default function ControlPanel() {

  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [selectedControlPanelId, setSelectedControlPanelId] = useState();
  const [arrayAllControlPanel, setArrayAllControlPanel] = useState([]);

  const [cards, setCards] = useState([]);

  // Для модального окна статистики
  const [openModalStatistic, setOpenModalStatistic] = useState(false);
  const [modalStatisticName, setModalStatisticName] = useState("");
  const [modalStatisticDatas, setModalStatisticDatas] = useState([]);

  const {
    reduxSelectedOrganizationId,
    reduxSelectedOrganizationReportDay,

    // Получение всех панелей по организации
    allControlPanel,
    isLoadingGetAllControlPanel,
    isFetchingGetAllControlPanel,
    isErrorGetAllControlPanel,

    // Получение панели по id
    currentControlPanel,
    statisticsIdsInPanel,
    statisticsPoints,
    isLoadingGetontrolPanelId,
    isFetchingGetontrolPanelId,
    isErrorGetontrolPanelId,

    // Создание панели
    postControlPanel,
    isLoadingPostControlPanelMutation,
    isSuccessPostControlPanelMutation,
    isErrorPostControlPanelMutation,
    ErrorPostControlPanel,

    //  Обновление
    updateControlPanel,
    isLoadingUpdateControlPanelMutation,
    isSuccessUpdateControlPanelMutation,
    isErrorUpdateControlPanelMutation,
    ErrorUpdateControlPanel,

    // Удаление статистики
    deleteControlPanel,
    isLoadingDeleteControlPanelMutation,
    isSuccessDeleteControlPanelMutation,
    isErrorDeleteControlPanelMutation,
    ErrorDeleteControlPanel,
  } = useControlPanel({ selectedControlPanelId });

  const { allPosts, isLoadingGetPosts, isErrorGetPosts } = usePostsHook();

  const {
    selectedID: selectedPostIdForCreated,
    selectedName,

    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,
  } = useModalSelectRadio({ array: allPosts, arrayItem: "postName" });

  const getControlPanelId = (id) => {
    saveToIndexedDB(
      reduxSelectedOrganizationId,
      arrayAllControlPanel.map(({ id, orderNumber, panelName }) => ({
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
  const removeControlPanel = async () => {
    try {
      // Удаляем панель управления через API
      await deleteControlPanel({
        controlPanelId: selectedControlPanelId,
      }).unwrap();

      // Закрываем модальное окно
      setOpenModalDelete(false);

      // Удаляем панель управления из IndexedDB
      deleteFromIndexedDB(reduxSelectedOrganizationId, selectedControlPanelId)
        .then(() => {
          console.log(
            `Панель управления с id ${selectedControlPanelId} успешно удалена из IndexedDB.`
          );
        })
        .catch((error) => {
          console.error("Ошибка при удалении из IndexedDB:", error);
        });
    } catch (error) {
      console.error(
        "Ошибка при удалении панели управления:",
        JSON.stringify(error, null, 2)
      );
    }
  };

  const onDragEnd_ControlPanel = async (result) => {
    const { source, destination } = result;

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
        updatedArray.map(({ id, orderNumber, panelName }) => ({
          id,
          orderNumber,
          panelName,
        }))
      );

      console.log("Данные успешно сохранены в IndexedDB");
    } catch (error) {
      console.error("Ошибка при сохранении данных в IndexedDB:", error);
    }
  };

  const btnYes = () => {
    removeControlPanel();
  };

  const btnNo = () => {
    setOpenModalDelete(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    updatePanelToStatisticsUpdateOrderNumbers,
    isLoadingPanelToStatisticsUpdateOrderNumbersMutation,
    isSuccessPanelToStatisticsUpdateOrderNumbersMutation,
    isErrorPanelToStatisticsUpdateOrderNumbersMutation,
    ErrorPanelToStatisticsUpdateOrderNumbersMutation,
    resetPanelToStatisticsUpdateOrderNumbersMutation,
    localIsResponsePanelToStatisticsUpdateOrderNumbersMutation,
  } = usePanelToStatisticsHook();

  const debouncedUpdate = useCallback(
    debounce((updatedStatistics) => {
      updatePanelToStatisticsUpdateOrderNumbers(updatedStatistics);
    }, 5000),
    []
  );

  const handleDragEnd_CardStatstic = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        const updatedStatistics = newItems.map((item, index) => ({
          _id: item.panelToStatisticsId,
          orderStatisticNumber: index + 1,
        }));

        debouncedUpdate(updatedStatistics);

        return newItems;
      });
    }
  };

  useEffect(() => {
    if (Object.keys(allControlPanel).length > 0) {
      loadFromIndexedDB(reduxSelectedOrganizationId, (data) => {
        if (data.length > 0) {
          setArrayAllControlPanel(() => {
            return allControlPanel
              .map((panel) => {
                const matchingData = data.find((item) => item.id === panel.id);
                if (matchingData) {
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
  }, [allControlPanel]);

  useEffect(() => {
    if (statisticsPoints.length > 0) {
      setCards(statisticsPoints);
    }
  }, [statisticsPoints]);
  return (
    <div className={classes.wrapper}>
      <Header onRightIcon={true} rightIconClick={openCreate}>
        Панель управления
      </Header>

      <div className={classes.body}>
        <DragDropContext onDragEnd={onDragEnd_ControlPanel}>
          <Droppable droppableId="panelList" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.droppableContainer}
              >
                {arrayAllControlPanel?.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <PanelDragDrop
                          isActive={currentControlPanel.id === item.id}
                          openSetting={() => setOpenModalSetting(true)}
                          name={
                            item.isNameChanged
                              ? item.panelName
                              : `${item.panelName} ${item.controlPanelNumber}`
                          }
                          onClick={() => getControlPanelId(item.id)}
                          deletePanel={() => setOpenModalDelete(true)}
                        ></PanelDragDrop>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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
                    type={"Прямая"}
                    typeGraphic={currentControlPanel.graphType}
                    reportDay={reduxSelectedOrganizationReportDay}
                    setOpenModalStatistic={setOpenModalStatistic}
                    setModalStatisticName={setModalStatisticName}
                    setModalStatisticDatas={setModalStatisticDatas}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {openModalSetting && (
          <ModalSetting
            exit={() => setOpenModalSetting(false)}
            updateControlPanel={updateControlPanel}
            currentControlPanel={currentControlPanel}
            statisticsIdsInPanel={statisticsIdsInPanel}
          ></ModalSetting>
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
            array={allPosts}
            arrayItem={"postName"}
            selectedItemID={selectedPostIdForCreated}
            save={createControlPanel}
          ></ModalSelectRadio>
        )}
        {openModalDelete && (
          <ModalContainer
            setOpenModal={btnNo}
            clickFunction={btnYes}
            buttonText={"Удалить"}
          >
            {`Вы точно хотите удалить панель управления ${
              currentControlPanel.isNameChanged
                ? currentControlPanel.panelName
                : `${currentControlPanel.panelName} ${currentControlPanel.controlPanelNumber}`
            }`}
          </ModalContainer>
        )}
        {openModalStatistic && (
          <ModalStatistic
            data={modalStatisticDatas}
            name={modalStatisticName}
            graphicTypeBD={currentControlPanel.graphType}
            type={"Прямая"}
            exit={() => setOpenModalStatistic(false)}
            reportDay={reduxSelectedOrganizationReportDay}
          ></ModalStatistic>
        )}
      </div>
    </div>
  );
}
