import React from "react";

import {
  Space,
  Button,
  Input,
  Select,
  Form,
  Flex,
  Drawer as DrawerAnt,
} from "antd";

import { isMobile } from "react-device-detect";


import useDrawerUpdateProject from "../../componentLogic/useDrawerUpdateProject";

export default function DrawerUpdateProject({
  currentProject,
  isLoadingGetProjectId,
  open,
  setOpen,
  disabled,
  programId,
}) {


  const {
    form,
    isSaving,
    setIsSaving,
    strategies,
    isLoadingGetNew,

    currentProgram,
    isLoadingGetProgramId,
    isErrorGetProgramId,
    isFetchingGetProgramId,

    updateProject,
    isLoadingUpdateProjectMutation,
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    ErrorUpdateProjectMutation,
    localIsResponseUpdateProjectMutation,

    handlePostValuesChange,
    handleSave,
    handleReset,
  } = useDrawerUpdateProject({
    currentProject,
    isLoadingGetProjectId,
    open,
    setOpen,
    disabled,
    programId,
  });
  
  return (
    <>
      <DrawerAnt
        closable
        destroyOnClose2
        title={<div style={{ whiteSpace: "nowrap" }}>Обновление проекта</div>}
        placement="right"
        open={open}
        loading={isLoadingGetProjectId || isLoadingGetNew}
        onClose={() => {
          setOpen(false);
          handleReset();
        }}
        width={isMobile ? 300 : 350}
      >
        <Flex vertical={true} style={{ height: "100%" }}>
          <Form
            disabled={disabled}
            form={form}
            onValuesChange={handlePostValuesChange}
            layout="vertical"
            style={{ flexGrow: 1 }}
          >
            {/* Название проекта */}
            <Form.Item
              label="Название проекта"
              name="projectName"
              rules={[
                { required: true, message: "Пожалуйста, введите название!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Программа у проекта */}
            {programId ? (
              <Form.Item label="Программа у проекта">
                <Input disabled value={currentProgram?.projectName} />
              </Form.Item>
            ) : null}

            {/* Стратегия */}

            {programId ? (
              <Form.Item label="Стратегия">
                <Select
                  disabled
                  value={currentProgram?.strategy?.id}
                  options={strategies.map((strategy) => ({
                    label: "Стратегия" + " " + strategy.strategyNumber,
                    value: strategy.id,
                  }))}
                />
              </Form.Item>
            ) : (
              <Form.Item label="Стратегия" name="strategyId">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={strategies.map((strategy) => ({
                    label: "Стратегия" + " " + strategy.strategyNumber,
                    value: strategy.id,
                  }))}
                />
              </Form.Item>
            )}
          </Form>

          <Space style={{ marginTop: "auto" }}>
            <Button
              type="primary"
              onClick={handleSave}
              loading={isSaving}
              disabled={disabled}
            >
              Сохранить
            </Button>
            <Button onClick={handleReset} disabled={disabled}>
              Сбросить
            </Button>
          </Space>
        </Flex>
      </DrawerAnt>
    </>
  );
}
