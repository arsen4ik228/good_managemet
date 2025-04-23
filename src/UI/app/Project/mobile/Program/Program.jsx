import React from "react";

import CustomTableProgram from "./CustomTableProgram";
import DrawerUpdateProgram from "./DrawerUpdateProgram";


import _ from "lodash";
import {
  Tabs,
  Button,

  Popconfirm,
  Select,
  Typography,
  Flex,

} from "antd";
import {

  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import usePrograma from "../../componentLogic/usePrograma";

export default function Program({ activeTabTypesProgram, disabledTable}) {
  
  const styleMessages = {
    transform: "rotate(90deg) translateY(-95vw) translateX(28vh)",
    transformOrigin: "top left",
  };

  const {
    selectedProgramId,
    setSelectedProgramId,
    selectedStrategyId,
    setSelectedStrategyId,
    selectedProjectIds,
    setSelectedProjectIds,
    descriptionProgram,
    setDescriptionProgram,
    form,
    isSaving,
    setIsSaving,
    tables,
    setTables,
    targetStateOnProduct,
    setTargetStateOnProduct,
    expandedRowKeys,
    setExpandedRowKeys,
    items,
    setItems,
    activeTab,
    setActiveTab,
    openDrawer,
    setOpenDrawer,
    // Получение данных проектов
    programs,
    archivesPrograms,
    isErrorGetProject,
    isLoadingGetProject,
    // Получение данных выбранного проекта

    currentProgram,
    currentProjects,
    targets,
    isLoadingGetProgramId,
    isErrorGetProgramId,
    isFetchingGetProgramId,
    // Данные для создания программы
    posts,
    strategies,
    projects,

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
    // методы
    onChangeTab,
    addProgram,
    resetUseState,
    updateSingleProject,
  } = usePrograma({ activeTabTypesProgram, styleMessages});

  return (
    <div style={{ width: "calc(100vh -50px)" }}>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Tabs
          style={{ width: "calc(100% - 40px)" }}
          type={activeTabTypesProgram === "programs" ? "editable-card" : "card"}
          activeKey={activeTab}
          items={items}
          onChange={onChangeTab}
          addIcon={
            <Popconfirm
              transitionName="" // Отключаем анимацию Ant Design
              overlayStyle={{
                transform: "rotate(90deg)",
                transformOrigin: "left top",
                height: "200px",
                width: "200px",
                overflow: "hidden",
              }}
              placement="bottomLeft"
              showCancel={false}
              okButtonProps={{ style: { display: "none" } }}
              icon={null}
              description={
                <div>
                  <Flex vertical gap={"small"}>
                    <Typography>Выберите стратегию</Typography>
                    <Select
                      transitionName="" // Отключаем анимацию Ant Design
                      dropdownStyle={{
                        width: "150px",
                        height: "145px",
                        transform: "rotate(90deg)",
                        overflow: "auto",
                      }}
                      style={{ width: "160px" }}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      value={selectedStrategyId}
                      onChange={(strategy) => setSelectedStrategyId(strategy)}
                      filterOption={(input, option) =>
                        option?.label
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={strategies.map((strategy) => ({
                        label: "Стратегия" + " " + strategy.strategyNumber,
                        value: strategy.id,
                      }))}
                    />
                  </Flex>
                  <Button
                    style={{ marginTop: "10px", marginLeft: "55px" }}
                    size="small"
                    type="primary"
                    onClick={addProgram}
                    disabled={!selectedStrategyId}
                  >
                    сохранить
                  </Button>
                </div>
              }
            >
              <Button size="small" type="text" icon={<PlusOutlined />} />
            </Popconfirm>
          }
        />
        <Button
          type="primary"
          style={{ width: "40px" }}
          icon={<SaveOutlined />}
          onClick={updateSingleProject}
          loading={isSaving}
        />
      </Flex>

      {selectedProgramId && (
        <DrawerUpdateProgram
          currentProgram={currentProgram}
          isLoadingGetProgramId={isLoadingGetProgramId}
          open={openDrawer}
          setOpen={setOpenDrawer}
          disabled={activeTabTypesProgram === "archivesPrograms" ? true : false}
          styleMessages={styleMessages}
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
        setDescriptionProgram={setDescriptionProgram}
        descriptionProgram={descriptionProgram}
      ></CustomTableProgram>
    </div>
  );
}
