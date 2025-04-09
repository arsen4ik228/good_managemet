import React, { useState, useEffect } from "react";
import { useAllProject } from "@hooks/Project/useAllProject";
import { useGetSingleProject } from "@hooks/Project/useGetSingleProject";
import { useCreateProject } from "@hooks/Project/useCreateProject";
import { Tabs, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useGetDataForCreateProject } from "@hooks/Project/useGetDataForCreateProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";
import CustomTable from "./CustomTable";
import DrawerUpdateProject from "./DrawerUpdateProject";

export default function Project({ activeTabTypes }) {
  const [selectedProjectId, setSelectedProjectId] = useState();
  const [activeTab, setActiveTab] = useState(null);
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
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
        projectName: "Новый проект",
        type: "Проект",
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
      const targetCreateDtos = tables.flatMap((table) => table.elements.filter((element) => element.isCreated === true).map(({isCreated, id,targetState, ...rest}) => rest));

      console.log("targetCreateDtos", targetCreateDtos);
      await updateProject({
        projectId: currentProject.id,
        _id: currentProject.id,
        // targetUpdateDtos: [],
        targetCreateDtos,
      }).unwrap();

    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
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
              label: item.projectName,
              closable: false,
            })),
          ];
          break;

        case "projectsWithProgram":
          tabsItems = [
            ...projectsWithProgram.map((item) => ({
              key: item.id,
              label: item.projectName,
              closable: false,
            })),
          ];
          break;

        case "archivesProjectsWithProgram":
          tabsItems = [
            ...archivesProjectsWithProgram.map((item) => ({
              key: item.id,
              label: item.projectName,
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

  // Инициализация таблиц при изменении выбранного проекта
  useEffect(() => {
    if (selectedProjectId && targets) {
      const createTableData = (type) => ({
        tableName: type,
        elements: targets
          .filter((item) => item.type === type)
          .map((item) => ({ ...item })) // Создаем копии объектов
          .sort((a, b) => a.orderNumber - b.orderNumber),
      });

      setTables([
        createTableData("Продукт"),
        createTableData("Обычная"),
        createTableData("Организационные мероприятия"),
        createTableData("Правила"),
        createTableData("Статистика"),
      ]);
    }
  }, [selectedProjectId, targets]);

  return (
    <div style={{ width: "100%" }}>
      <Button onClick={updateSingleProject}>save</Button>
      <Tabs
        type="editable-card"
        activeKey={activeTab}
        items={items}
        onChange={onChangeTab}
        onEdit={addProject}
      />

      {selectedProjectId && (
        <DrawerUpdateProject
        currentProject={currentProject}
          selectedProjectId={selectedProjectId}
          open={openDrawer}
          setOpen={setOpenDrawer}
        />
      )}

      <CustomTable
        selectedProjectId={selectedProjectId}
        tables={tables}
        setTables={setTables}
        isLoadingGetProjectId={isLoadingGetProjectId}
        isFetchingGetProjectId={isFetchingGetProjectId}
        targets={targets}
        posts={posts}
      ></CustomTable>
    </div>
  );
}
