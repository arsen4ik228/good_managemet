import React, { useState, useEffect } from "react";

import { useAllProject } from "@hooks/Project/useAllProject";
import { useGetSingleProject } from "@hooks/Project/useGetSingleProject";
import { useCreateProject } from "@hooks/Project/useCreateProject";
import { useGetDataForCreateProject } from "@hooks/Project/useGetDataForCreateProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";

import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import _ from "lodash";

export default function useProject({ activeTabTypes, styleMessages }) {
  const [selectedProjectId, setSelectedProjectId] = useState();
  const [descriptionProduct, setDescriptionProduct] = useState(null);

  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [tables, setTables] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);

  // Получение данных проектов
  const {
    projects,
    archivesProjects,
    projectsWithProgram,
    archivesProjectsWithProgram,
    isErrorGetProject,
    isLoadingGetProject,
  } = useAllProject();

  // Получение данных выбранного проекта
  const {
    currentProject,
    targets,
    isLoadingGetProjectId,
    isErrorGetProjectId,
    isFetchingGetProjectId,
  } = useGetSingleProject({ selectedProjectId });

  // Данные для создания проекта
  const {
    posts,
    programs,

    isLoadingGetNew,
    isErrorGetNew,
  } = useGetDataForCreateProject();

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
    setSelectedProjectId(key);
  };

  // Создание нового проекта
  const addProject = async () => {
    try {
      const createdProject = await createProject({
        organizationId: reduxSelectedOrganizationId,
        projectName: `Новый проект ${items.length}`,
        type: "Проект",
        content: " ",
        targetCreateDtos: [
          {
            type: "Продукт",
            orderNumber: 1,
            content: " ",
          },
        ],
      }).unwrap();

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
    setSelectedProjectId(null);
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

      let targetUpdateDtos = [];

      if (changeTypeStateOnAllTarget) {
        targetUpdateDtos = tables
          .filter((table) => table.tableName !== "Описание")
          .flatMap((table) =>
            table.elements
              .filter((element) => element.isCreated !== true)
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

                  return { ...baseItem, targetState: "Активная" };
                }
              )
          );
      } else {
        targetUpdateDtos = tables
          .filter((table) => table.tableName !== "Описание")
          .flatMap((table) =>
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

                  return baseItem;
                }
              )
          );
      }

      await updateProject({
        projectId: currentProject.id,
        _id: currentProject.id,
        content: descriptionProduct,
        targetUpdateDtos,
        targetCreateDtos,
      }).unwrap();

      setExpandedRowKeys(prevStateExpandedRowKeys);
      message.success({
        content: "Данные успешно обновлены!",
        style: styleMessages,
      });
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

        message.error({
          content: "Пожалуйста, заполните все обязательные поля.",
          style: styleMessages,
        });
      } else {
        message.error({
          content: "Ошибка при обновлении.",
          style: styleMessages,
        });
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
      switch (activeTabTypes) {
        case "projects":
          tabsItems = [
            ...projects.map((item) => ({
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

        case "archivesProjects":
          tabsItems = [
            ...archivesProjects.map((item) => ({
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

        case "projectsWithProgram":
          tabsItems = [
            ...projectsWithProgram.map((item) => ({
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

        case "archivesProjectsWithProgram":
          tabsItems = [
            ...archivesProjectsWithProgram.map((item) => ({
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
  }, [
    activeTabTypes,
    projects,
    archivesProjects,
    projectsWithProgram,
    archivesProjectsWithProgram,
  ]);

  useEffect(() => {
    if (currentProject?.content) {
      console.log(currentProject?.content);
      setDescriptionProduct(currentProject?.content);
    }
  }, [currentProject]);

  return {
    onChangeTab,
    addProject,
    updateSingleProject,
    selectedProjectId,
    setSelectedProjectId,
    descriptionProduct,
    setDescriptionProduct,
    form,
    isSaving,
    setIsSaving,
    tables,
    setTables,
    expandedRowKeys,
    setExpandedRowKeys,
    items,
    setItems,
    activeTab,
    setActiveTab,
    openDrawer,
    setOpenDrawer,
    // Получение данных проектов
    projects,
    archivesProjects,
    projectsWithProgram,
    archivesProjectsWithProgram,
    isErrorGetProject,
    isLoadingGetProject,
    // Получение данных выбранного проекта
    currentProject,
    targets,
    isLoadingGetProjectId,
    isErrorGetProjectId,
    isFetchingGetProjectId,
    // Данные для создания проекта
    posts,
    programs,

    isLoadingGetNew,
    isErrorGetNew,
    // Создание нового проекта
    reduxSelectedOrganizationId,
    createProject,
    isLoadingProjectMutation,

    // Обновление проекта
    updateProject,
    isLoadingUpdateProjectMutation,
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    ErrorUpdateProjectMutation,
    localIsResponseUpdateProjectMutation,
  };
}
