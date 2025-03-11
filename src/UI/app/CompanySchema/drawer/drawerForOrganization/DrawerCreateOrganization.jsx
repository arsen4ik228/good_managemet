import React, { useState, useEffect } from "react";
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
import { useCreateOrganization } from "@hooks";
import { days, ColorPickerModal, styles } from "../../constants/contsants.js";

export default function DrawerCreateOrganization({
  open,
  setOpen,
  allOrganizations,
}) {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#BFCFE7");

  const {
    createOrganization,
    isLoadingCreateOrganizationMutation,
    isSuccessCreateOrganizationMutation,
    isErrorCreateOrganizationMutation,
    ErrorCreateOrganization,
    localIsResponseCreateOrganizationMutation,
  } = useCreateOrganization();

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

      console.log(response);
      await createOrganization({
        ...response,
        organizationColor: selectedColor,
      }).unwrap();

      message.success("Организация создана!");
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
    form.setFieldsValue({
      organizationName: null,
      reportDay: null,
      parentOrganizationId: null,
    });
    setSelectedColor("#BFCFE7"); // Сбрасываем выбранный цвет
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Инициализация формы при открытии Drawer
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        organizationName: null,
        reportDay: null,
        parentOrganizationId: null,
      });
    }
  }, [open]);

  return (
    <DrawerAnt
      closable
      destroyOnClose2
      title={<p>Создание организации</p>}
      placement="right"
      open={open}
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
              options={allOrganizations.map((org) => ({
                label: org.organizationName,
                value: org.id,
              }))}
            />
          </Form.Item>

          {/* Цвет организации*/}
          <Form.Item label="Цвет организации" name="organizationColor">
            <Popover
              placement={isMobile ? "top" : "topLeft"}
              content={
                <ColorPickerModal
                  onColorSelect={handleColorSelect}
                  selectedColor={selectedColor}
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
  );
}
