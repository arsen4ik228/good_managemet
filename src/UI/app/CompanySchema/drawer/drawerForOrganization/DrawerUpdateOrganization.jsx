import React, { useState, useEffect } from "react";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
import edit from "@image/edit.svg";
import {
  Space,
  Button,
  Input,
  Select,
  Form,
  Flex,
  Popover,
  Drawer as DrawerAnt,
} from "antd";
import { message } from "antd";
import { isMobile } from "react-device-detect";

import { useGetSingleOrganization, useUpdateSingleOrganization } from "@hooks";
import { days, ColorPickerModal, styles } from "../../constants/contsants.js";

export default function DrawerUpdateOrganization({
  organizationId,
  allOrganizations,
}) {
  const [open, setOpen] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#BFCFE7");

  const {
    currentOrganization,
    isLoadingOrganizationId,
    isFetchingOrganizationId,
  } = useGetSingleOrganization({ organizationId, enabled: shouldFetchData });

  const {
    updateOrganization,
    isLoadingUpdateOrganizationMutation,
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    ErrorOrganization,
    localIsResponseUpdateOrganizationMutation,
  } = useUpdateSingleOrganization();

  const showLoading = () => {
    setOpen(true);
    setShouldFetchData(true); // Устанавливаем флаг для вызова хука
  };

  const handlePostValuesChange = (changedValues, allValues) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(allValues).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
    form.setFieldsValue(cleanedValues);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await form.validateFields();
      await updateOrganization({
        _id: currentOrganization.id,
        ...response,
        organizationColor: selectedColor,
      }).unwrap();
      message.success("Данные успешно обновлены!");
      setOpen(false);
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error("Ошибка при обновлении поста.");
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedColor(currentOrganization.organizationColor);
    form.setFieldsValue({
      organizationName: currentOrganization.organizationName ?? null,
      reportDay: currentOrganization.reportDay ?? null,
      parentOrganizationId: currentOrganization.parentOrganizationId ?? null,
    });
  };

  useEffect(() => {
    if (
      !currentOrganization ||
      isLoadingOrganizationId ||
      isFetchingOrganizationId
    )
      return;

    const initialValues = {
      organizationName: currentOrganization.organizationName ?? null,
      reportDay: currentOrganization.reportDay ?? null,
      parentOrganizationId: currentOrganization.parentOrganizationId ?? null,
    };

    if (currentOrganization.organizationColor !== selectedColor) {
      setSelectedColor(currentOrganization.organizationColor);
    }

    form.setFieldsValue(initialValues);
  }, [currentOrganization, isLoadingOrganizationId, isFetchingOrganizationId]);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <ButtonImage
        dataTour="setting-button"
        name={"редактировать"}
        icon={edit}
        onClick={showLoading}
      ></ButtonImage>
      <DrawerAnt
        closable
        destroyOnClose2
        title={<div style={{whiteSpace: "nowrap"}}>Обновление организации</div>}
        placement="right"
        open={open}
        loading={isLoadingOrganizationId || isFetchingOrganizationId}
        onClose={() => setOpen(false)}
        width={isMobile ? 300 : 350}
      >
        <Flex vertical={true} style={{ height: "100%" }}>
          <Form
            form={form}
            onValuesChange={handlePostValuesChange}
            layout="vertical"
            style={{ flexGrow: 1 }}
          >
            {/* Название организации */}
            <Form.Item
              label="Название организации"
              name="organizationName"
              rules={[
                { required: true, message: "Пожалуйста, введите название!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Отчетный день*/}
            <Form.Item
              label="Отчетный день"
              name="reportDay"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите отчетный день!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
                options={days.map((day) => ({
                  label: day.name,
                  value: day.id,
                }))}
              />
            </Form.Item>

            {/* Родительская организация */}
            <Form.Item
              label="Родительская организация"
              name="parentOrganizationId"
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
                options={allOrganizations?.map((org) => ({
                  label: org.organizationName,
                  value: org.id,
                }))}
              />
            </Form.Item>

            {/* Цвет организации*/}
            <Form.Item label="Цвет организации">
              <Popover
                placement={isMobile ? "top" : "topLeft"}
                content={
                  <ColorPickerModal
                    onColorSelect={handleColorSelect}
                    selectedColor={selectedColor}
                    colorFromBD={currentOrganization.organizationColor}
                  />
                }
              >
                <div
                  style={{
                    ...styles.colorBox,
                    backgroundColor: selectedColor,
                  }}
                />
              </Popover>
            </Form.Item>
          </Form>

          <Space style={{ marginTop: "auto" }}>
            <Button type="primary" onClick={handleSave} loading={isSaving}>
              Сохранить
            </Button>
            <Button onClick={handleReset}>Сбросить</Button>
          </Space>
        </Flex>
      </DrawerAnt>
    </div>
  );
}
