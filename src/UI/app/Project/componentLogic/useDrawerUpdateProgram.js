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

export default function useDrawerUpdateProgram({
    currentProgram,
    isLoadingGetProjectId,
    open,
    setOpen,
    disabled,
    styleMessages,
}) {
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
      message.success( {
        content: "Данные успешно обновлены!", 
        style: styleMessages,
      });
      setOpen(false);
    } catch (error) {
      if (error.errorFields) {
        message.error({
          content: "Пожалуйста, заполните все поля корректно.", 
          style: styleMessages,
        });
      } else {
        message.error({
          content: "Ошибка при обновлении.", 
          style: styleMessages,
        });
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

  return {
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
  };
}
