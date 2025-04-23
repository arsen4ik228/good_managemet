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

import useDrawerUpdateProgram from "../../componentLogic/useDrawerUpdateProgram";

export default function DrawerUpdateProgram({
  currentProgram,
  isLoadingGetProjectId,
  open,
  setOpen,
  disabled,
  styleMessages,
}) {
  const stylesColumnSelect = {
    transitionName: "",
    style: { width: "100%" },
    dropdownStyle: {
      width: "150px",
      height: "145px",
      transform: "rotate(90deg)",
      overflow: "auto",
    },
  };

  const {
    form,
    isSaving,
    setIsSaving,
    strategies,
    isLoadingGetNew,
    updateProject,
    isLoadingUpdateProjectMutation,
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    ErrorUpdateProjectMutation,
    localIsResponseUpdateProjectMutation,
    handlePostValuesChange,
    handleSave,
    handleReset,
  } = useDrawerUpdateProgram({
    currentProgram,
    isLoadingGetProjectId,
    open,
    setOpen,
    disabled,
    styleMessages,
  });

  return (
    <>
      <DrawerAnt
        style={{
          position: "fixed",
          width: "50vh",
          height: "100vw",
          top: 0,
          left: 0,
          transform: "rotate(90deg) translateY(-100%)",
          transformOrigin: "top left",
          overflow: "hidden",
        }}
        closable
        destroyOnClose2
        title={<div style={{ whiteSpace: "nowrap" }}>Обновление программы</div>}
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
            {/* Название организации */}
            <Form.Item
              label="Название программы"
              name="projectName"
              rules={[
                { required: true, message: "Пожалуйста, введите название!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Отчетный день*/}
            <Form.Item label="Стратегия" name="strategyId">
              <Select
                {...stylesColumnSelect}
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
