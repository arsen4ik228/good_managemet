import React from "react";

import CustomTableProject from "./CustomTableProject";
import DrawerUpdateProject from "./DrawerUpdateProject";

import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import { Tabs, Button, Flex, Tooltip } from "antd";
import _ from "lodash";
import useProject from "../../componentLogic/useProject";

export default function Project({ activeTabTypes, disabledTable }) {
  const {
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

    targetStateOnProduct,
    setTargetStateOnProduct,
  } = useProject({ activeTabTypes });

  return (
    <div style={{ width: "100%" }}>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Tabs
          style={{ width: "calc(100% - 40px)" }}
          type={activeTabTypes === "projects" ? "editable-card" : "card"}
          activeKey={activeTab}
          items={items}
          onChange={onChangeTab}
          // onEdit={addProject}
          addIcon={
            <Tooltip placement="bottom" title={"создать проект"}>
              <Button
                onClick={addProject}
                size="small"
                type="text"
                icon={<PlusOutlined />}
              />
            </Tooltip>
          }
        />

        <Tooltip placement="bottom" title={"сохранить"}>
          <Button
            type="primary"
            style={{ width: "40px", marginBottom:"15px" }}
            icon={<SaveOutlined />}
            onClick={updateSingleProject}
            loading={isSaving}
          />
        </Tooltip>
      </Flex>

      {selectedProjectId && (
        <DrawerUpdateProject
          currentProject={currentProject}
          isLoadingGetProjectId={isLoadingGetProjectId}
          open={openDrawer}
          setOpen={setOpenDrawer}
          disabled={
            activeTabTypes === "archivesProjects" ||
            activeTabTypes === "archivesProjectsWithProgram"
              ? true
              : false
          }
          programId={currentProject.programId}
        />
      )}

      <CustomTableProject
        expandedRowKeys={expandedRowKeys}
        setExpandedRowKeys={setExpandedRowKeys}
        form={form}
        selectedProjectId={selectedProjectId}
        disabledTable={disabledTable}
        tables={tables}
        setTables={setTables}
        isLoadingGetProjectId={isLoadingGetProjectId}
        isFetchingGetProjectId={isFetchingGetProjectId}
        targets={targets}
        // targetStateOnProduct={targets.find(
        //   (target) =>
        //     target.type === "Продукт" && target.targetState === "Активная"
        // )}
        targetStateOnProduct={targetStateOnProduct}
        setTargetStateOnProduct={setTargetStateOnProduct}
        
        posts={posts}
        setDescriptionProduct={setDescriptionProduct}
        descriptionProduct={descriptionProduct}
      ></CustomTableProject>
    </div>
  );
}
