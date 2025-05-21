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
  Tooltip,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import usePrograma from "../../componentLogic/usePrograma";

export default function Program({ activeTabTypesProgram, disabledTable }) {
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
  } = usePrograma({ activeTabTypesProgram });


  
  return (
    <div style={{ width: "100%" }}>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Tabs
          style={{ width: "calc(100% - 40px)" }}
          type={activeTabTypesProgram === "programs" ? "editable-card" : "card"}
          activeKey={activeTab}
          items={items}
          onChange={onChangeTab}
          addIcon={
            <Tooltip  placement="bottom" title={"создать программу"}>
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
                  </>
                }
              >
                <Button  data-tour="create-button" size="small" type="text" icon={<PlusOutlined />} />
              </Popconfirm>
            </Tooltip>
          }
        />
        
        <Tooltip placement="bottom" title={"сохранить"}>
          <Button
            data-tour="save-button"
            type="primary"
            style={{ width: "40px" }}
            icon={<SaveOutlined />}
            onClick={updateSingleProject}
            loading={isSaving}
          />
        </Tooltip>
      </Flex>

      {selectedProgramId && (
        <DrawerUpdateProgram
          currentProgram={currentProgram}
          isLoadingGetProgramId={isLoadingGetProgramId}
          open={openDrawer}
          setOpen={setOpenDrawer}
          disabled={activeTabTypesProgram === "archivesPrograms" ? true : false}
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
