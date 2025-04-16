import React, { useState, useEffect } from "react";
import { useAllProject } from "@hooks/Project/useAllProject";
import { useGetSingleProgram } from "@hooks/Project/useGetSingleProgram";
import { useCreateProject } from "@hooks/Project/useCreateProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";
import CustomTableProgram from "./CustomTableProgram";
import DrawerUpdateProgram from "./DrawerUpdateProgram";
import { useGetDataForCreateProgram } from "@hooks/Project/useGetDataForCreateProgram";

import _ from "lodash";
import {
  Tabs,
  Button,
  Form,
  message,
  Popconfirm,
  Select,
  Typography,
  Flex,
} from "antd";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";

export default function Program({ activeTabTypesProgram, disabledTable }) {
  const [selectedProgramId, setSelectedProgramId] = useState();
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);
  const [selectedProjectIds, setSelectedProjectIds] = React.useState([]);

  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [tables, setTables] = useState([]);
  const [targetStateOnProduct, setTargetStateOnProduct] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);

  // Получение данных проектов
  const {
    programs,
    archivesPrograms,

    isErrorGetProject,
    isLoadingGetProject,
  } = useAllProject();

  // Получение данных выбранного проекта
  const {
    currentProgram,
    currentProjects,
    targets,

    isLoadingGetProgramId,
    isErrorGetProgramId,
    isFetchingGetProgramId,
  } = useGetSingleProgram({ selectedProgramId });

  // Данные для создания программы
  const {
    posts,
    strategies,
    projects,

    isLoadingGetNew,
    isErrorGetNew,
  } = useGetDataForCreateProgram();

  // Создание нового проекта
  const {
    reduxSelectedOrganizationId,
    createProject,
    isLoadingProjectMutation,
  } = useCreateProject();

  // Обновление проекта
  const {
    updateProject,
    isLoadingUpdateProjectMutation,
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    ErrorUpdateProjectMutation,
    localIsResponseUpdateProjectMutation,
  } = useUpdateSingleProject();

  // Обработчик изменения вкладки
  const onChangeTab = (key) => {
    setActiveTab(key);
    setSelectedProgramId(key);
  };

  // Создание нового проекта
  const addProgram = async () => {
    try {
      const createdProject = await createProject({
        organizationId: reduxSelectedOrganizationId,
        projectName: `Новая программа ${items.length}`,
        type: "Программа",
        strategyId: selectedStrategyId,
        content: " ",
        targetCreateDtos: [
          {
            type: "Продукт",
            orderNumber: 1,
            content: " ",
          },
        ],
      }).unwrap();

      setSelectedStrategyId(null);
      setItems((prevItems) => [
        ...prevItems,
        {
          key: createdProject.id,
          label: createdProject.projectName,
          closable: false,
        },
      ]);
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
    }
  };

  const resetUseState = () => {
    setActiveTab(null);
    setTables([]);
    setSelectedProgramId(null);
  };

  // Обновление проекта
  const updateSingleProject = async () => {
    try {
      setIsSaving(true);

      const prevStateExpandedRowKeys = [...expandedRowKeys];

      const allKeys = tables.map((table) => `group-${table.tableName}`);
      setExpandedRowKeys(allKeys);

      // Немного подождать, чтобы DOM успел отрисовать элементы
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await form.validateFields();

      const isProductDraftInBD = targets.some(
        (target) =>
          target.type === "Продукт" && target.targetState === "Черновик"
      );

      const isProductActiveInChangeTables = tables
        .find((table) => table.tableName === "Продукт")
        ?.elements?.some((el) => el.targetState === "Активная");

      const changeTypeStateOnAllTarget =
        isProductDraftInBD && isProductActiveInChangeTables;

      const targetCreateDtos = tables.flatMap((table) =>
        table.elements
          .filter((element) => element.isCreated)
          .map(({ isCreated, id, ...rest }) => {
            const baseItem = _.omitBy(rest, _.isNull);

            return changeTypeStateOnAllTarget
              ? { ...baseItem, targetState: "Активная" }
              : baseItem;
          })
      );

      const targetUpdateDtos = tables.flatMap((table) =>
        table.elements
          .filter((element) => element.isUpdated === true)
          .map(
            ({
              isUpdated,
              id,
              createdAt,
              updatedAt,
              targetHolders,
              isExpired,
              ...rest
            }) => {
              const baseItem = {
                _id: id,
                ..._.omitBy(rest, _.isNull),
              };

              return changeTypeStateOnAllTarget
                ? { ...baseItem, targetState: "Активная" }
                : baseItem;
            }
          )
      );

      const selectedProjectIdsValues = selectedProjectIds.map(
        (project) => project.value
      );
      
      await updateProject({
        projectId: currentProgram.id,
        _id: currentProgram.id,
        targetUpdateDtos,
        targetCreateDtos,
        projectIds:selectedProjectIdsValues,
      }).unwrap();

      setExpandedRowKeys(prevStateExpandedRowKeys);
      message.success("Данные успешно обновлены!");
    } catch (error) {
      if (error?.errorFields) {
        // Собираем id записей с ошибками
        const errorRecordIds = error.errorFields
          .map((field) => field.name?.[0])
          .map((name) => {
            const parts = name.split("-");
            return parts.slice(1).join("-");
          })
          .filter(Boolean);

        // Находим таблицы (группы), где есть эти записи
        const tablesWithErrors = tables.filter((table) =>
          table.elements.some((el) => errorRecordIds.includes(el.id))
        );

        // Создаем ключи только для таблиц с ошибками
        const keysToExpand = tablesWithErrors.map(
          (table) => `group-${table.tableName}`
        );

        // 4. Убедимся, что state обновляется правильно
        setExpandedRowKeys((prevKeys) => {
          // Если ключи уже установлены, не обновляем
          if (JSON.stringify(prevKeys) === JSON.stringify(keysToExpand)) {
            return prevKeys;
          }
          return keysToExpand;
        });

        // 5. Добавим дополнительный setTimeout для гарантии обновления DOM
        setTimeout(() => {
          if (errorRecordIds.length > 0) {
            const errorFieldName = error.errorFields[0].name[0];
            const errorCell = document.querySelector(
              `[data-row-key="${errorRecordIds[0]}"] [data-field="${errorFieldName}"]`
            );

            if (errorCell) {
              // 1. Находим основной контейнер скролла таблицы
              const tableContainer = document.querySelector(
                ".ant-table-container"
              );

              // 2. Получаем позиции элемента и контейнера
              const cellRect = errorCell.getBoundingClientRect();
              const containerRect = tableContainer.getBoundingClientRect();

              // 3. Вычисляем необходимую прокрутку с учетом текущего положения
              const scrollLeft =
                cellRect.left -
                containerRect.left +
                tableContainer.scrollLeft +
                containerRect.width / 2;

              console.log("scrollLeft", scrollLeft);
              // 4. Применяем прокрутку
              tableContainer.scrollTo({
                left: scrollLeft,
                behavior: "smooth",
              });

              // 5. Вертикальная прокрутка (если нужно)
              errorCell.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        }, 300);

        message.error("Пожалуйста, заполните все обязательные поля.");
      } else {
        message.error("Ошибка при обновлении.");
        console.error("Ошибка:", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Инициализация вкладок при загрузке проектов
  useEffect(() => {
    if (!isErrorGetProject && !isLoadingGetProject) {
      resetUseState();
      let tabsItems = [];
      switch (activeTabTypesProgram) {
        case "programs":
          tabsItems = [
            ...programs.map((item) => ({
              key: item.id,
              label: (
                <>
                  <Button
                    size="small"
                    icon={
                      <EllipsisOutlined
                        style={{ transform: "rotate(90deg)" }}
                      />
                    }
                    onClick={() => setOpenDrawer(true)}
                    style={{ marginRight: "10px" }}
                  ></Button>
                  {item.projectName}
                </>
              ),
              closable: false,
            })),
          ];
          break;

        case "archivesPrograms":
          tabsItems = [
            ...archivesPrograms.map((item) => ({
              key: item.id,
              label: (
                <>
                  <Button
                    size="small"
                    icon={
                      <EllipsisOutlined
                        style={{ transform: "rotate(90deg)" }}
                      />
                    }
                    onClick={() => setOpenDrawer(true)}
                    style={{ marginRight: "10px" }}
                  ></Button>
                  {item.projectName}
                </>
              ),
              closable: false,
            })),
          ];
          break;

        default:
          tabsItems = [];
          break;
      }
      setItems(tabsItems);
    }
  }, [activeTabTypesProgram, programs, archivesPrograms]);

  return (
    <div style={{ width: "100%" }}>
      <Button type="primary" onClick={updateSingleProject} loading={isSaving}>
        save
      </Button>

      <Tabs
        type={activeTabTypesProgram === "programs" ? "editable-card" : "card"}
        activeKey={activeTab}
        items={items}
        onChange={onChangeTab}
        addIcon={
          <Popconfirm
            placement="rightBottom"
            showCancel={false}
            okButtonProps={{ style: { display: "none" } }}
            icon={null}
            description={
              <>
                <Flex vertical gap={"small"}>
                  <Typography>Выберите стратегию</Typography>
                  <Select
                    style={{ width: "160px" }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    value={selectedStrategyId}
                    onChange={(strategy) => setSelectedStrategyId(strategy)}
                    filterOption={(input, option) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={strategies.map((strategy) => ({
                      label: "Стратегия" + " " + strategy.strategyNumber,
                      value: strategy.id,
                    }))}
                  />
                </Flex>
                <Button
                  style={{ marginTop: "10px", marginLeft:"55px" }}
                  size="small"
                  type="primary"
                  onClick={addProgram}
                  disabled={!selectedStrategyId}
                >
                  сохранить
                </Button>
              </>
            }
          >
            <Button size="small" type="text" icon={<PlusOutlined />} />
          </Popconfirm>
        }
      />

      {selectedProgramId && (
        <DrawerUpdateProgram
          currentProgram={currentProgram}
          isLoadingGetProgramId={isLoadingGetProgramId}
          open={openDrawer}
          setOpen={setOpenDrawer}
          disabled={
            activeTabTypesProgram === "archivesPrograms"
              ? true
              : false
          }
        />
      )}

      <CustomTableProgram
        expandedRowKeys={expandedRowKeys}
        setExpandedRowKeys={setExpandedRowKeys}
        form={form}
        selectedProgramId={selectedProgramId}
        disabledTable={disabledTable}
        tables={tables}
        setTables={setTables}
        isLoadingGetProgramId={isLoadingGetProgramId}
        isFetchingGetProgramId={isFetchingGetProgramId}
        currentProjects={currentProjects}
        targets={targets}
        targetStateOnProduct={targetStateOnProduct}
        setTargetStateOnProduct={setTargetStateOnProduct}
        posts={posts}
        projects={projects}
        selectedProjectIds={selectedProjectIds}
        setSelectedProjectIds={setSelectedProjectIds}
      ></CustomTableProgram>
    </div>
  );
}
