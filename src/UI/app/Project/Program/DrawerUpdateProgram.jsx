import React, { useState, useEffect } from "react";

import {
  Space,
  Button,
  Input,
  Select,
  Form,
  Flex,
  Drawer as DrawerAnt,
} from "antd";
import { message } from "antd";
import { isMobile } from "react-device-detect";

import { useGetDataForCreateProject } from "@hooks/Project/useGetDataForCreateProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";


export default function DrawerUpdateProgram({currentProgram, isLoadingGetProjectId, open, setOpen, disabled }) {

  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const { strategies, isLoadingGetNew } = useGetDataForCreateProject();

  const {
    updateProject,
    isLoadingUpdateProjectMutation,
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    ErrorUpdateProjectMutation,
    localIsResponseUpdateProjectMutation,
  } = useUpdateSingleProject();

  const handlePostValuesChange = (changedValues, allValues) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(allValues).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
    form.setFieldsValue(cleanedValues);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await form.validateFields();
      await updateProject({
        projectId: currentProgram.id,
        _id: currentProgram.id,
        ...response,
      }).unwrap();
      message.success("Данные успешно обновлены!");
      setOpen(false);
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error("Ошибка при обновлении.");
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      projectName: currentProgram.projectName ?? null,
      strategyId: currentProgram.strategy?.id ?? null,
    });
  };

  useEffect(() => {
    if (!currentProgram.id) return;

    const initialValues = {
      projectName: currentProgram.projectName ?? null,
      strategyId: currentProgram.strategy?.id ?? null,
    };

    form.setFieldsValue(initialValues);
  }, [currentProgram.id]);

  return (
    <>
      <DrawerAnt
        closable
        destroyOnClose2
        title={<div style={{ whiteSpace: "nowrap" }}>Обновление проекта</div>}
        placement="right"
        open={open}
        loading={(isLoadingGetProjectId || isLoadingGetNew)}
        onClose={() => {setOpen(false); handleReset();}}
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
              label="Название проекта"
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
            <Button type="primary" onClick={handleSave} loading={isSaving}  disabled={disabled}>
              Сохранить
            </Button>
            <Button onClick={handleReset}  disabled={disabled}>Сбросить</Button>
          </Space>
        </Flex>
      </DrawerAnt>
    </>
  );
}
