import React, { useState, useEffect } from "react";

import {
  Space,
  Button,
  Input,
  Select,
  Form,
  Flex,
  Drawer as DrawerAnt,
  Typography,
} from "antd";
import { message } from "antd";
import { isMobile } from "react-device-detect";

import { useGetDataForCreateProject } from "@hooks/Project/useGetDataForCreateProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";
import { useGetSingleProgram } from "@hooks/Project/useGetSingleProgram";

export default function useDrawerUpdateProject({
  currentProject,
  isLoadingGetProjectId,
  open,
  setOpen,
  disabled,
  programId,
  styleMessages,
}) {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const { strategies, isLoadingGetNew } = useGetDataForCreateProject();

  const {
    currentProgram,
    isLoadingGetProgramId,
    isErrorGetProgramId,
    isFetchingGetProgramId,
  } = useGetSingleProgram({ selectedProgramId: programId });

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
        projectId: currentProject.id,
        _id: currentProject.id,
        ...response,
      }).unwrap();
      message.success({
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
      projectName: currentProject.projectName ?? null,
      strategyId: currentProject.strategy?.id ?? null,
    });
  };

  useEffect(() => {
    if (!currentProject.id) return;

    const initialValues = {
      projectName: currentProject.projectName ?? null,
      strategyId: currentProject.strategy?.id ?? null,
    };

    form.setFieldsValue(initialValues);
  }, [currentProject.id]);

  return {
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
  };
}
