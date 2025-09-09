import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Row,
  Col,
  Flex,
  message,
} from "antd";

import { useAllPosts, useUpdateSingleStatistic } from "@hooks";

const { TextArea } = Input;

const viewStatistic = [
  { value: "Прямая", label: "Прямая" },
  { value: "Обратная", label: "Обратная" },
];

const typeStatistic = [
  { value: true, label: "Активная" },
  { value: false, label: "Архивная" },
];

export const StatisticInformationDrawer = ({
  openDrawer,
  setOpenDrawer,

  setChartDirection,

  statisticId,

  currentStatistic,

  isLoadingGetStatisticId,
  isFetchingGetStatisticId,
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const { allPosts, isLoadingGetPosts, isFetchingGetPosts, isErrorGetPosts } =
    useAllPosts();

  // Обновление статистики
  const {
    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,
  } = useUpdateSingleStatistic();

  const handlePostValuesChange = (changedValues, allValues) => {
    if (changedValues?.type) {
      setChartDirection(changedValues.type);
    }

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
      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...response,
      }).unwrap();

      message.success("Данные успешно обновлены!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error(
          error?.data?.errors?.[0]?.errors?.[0]
            ? error.data.errors[0].errors[0]
            : error?.data?.message
        );
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      name: currentStatistic?.name ?? null,
      description: currentStatistic?.description ?? null,
      postId: currentStatistic?.post?.id ?? null,
      type: currentStatistic?.type ?? null,
      isActive: currentStatistic?.isActive ?? false,
    });
  };

  useEffect(() => {
    if (
      !statisticId ||
      !currentStatistic?.id ||
      isLoadingGetStatisticId ||
      isFetchingGetStatisticId
    ) {
      return;
    }

    const initialValues = {
      name: currentStatistic?.name ?? null,
      description: currentStatistic?.description ?? null,
      postId: currentStatistic?.post?.id ?? null,
      type: currentStatistic?.type ?? null,
      isActive: currentStatistic?.isActive ?? false,
    };

    form.setFieldsValue(initialValues);
  }, [
    statisticId,
    currentStatistic,
    isLoadingGetStatisticId,
    isFetchingGetStatisticId,
  ]);

  return (
    <Drawer
      title="Редактировать статистику"
      placement="left"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      mask={false}
      width={"27.5vw"}
      style={{
        position: "absolute",
        height: "100%",
      }}
      bodyStyle={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      loading={isFetchingGetStatisticId || isLoadingGetStatisticId}
    >
      <div style={{ padding: "16px", flex: 1, overflow: "auto" }}>
        <div style={{ overflowX: "hidden" }}>
          <Form
            form={form}
            onValuesChange={handlePostValuesChange}
            layout="vertical"
            disabled={!currentStatistic?.isActive}
          >
            <Row>
              <Col span={24}>
                {/* Название статистики */}
                <Form.Item
                  name="name"
                  label="Название статистики"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите название",
                    },
                  ]}
                >
                  <Input placeholder="Введите название" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                {/* Пост статистики*/}
                <Form.Item
                  name="postId"
                  label="Пост статистики"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, выберите пост",
                    },
                  ]}
                >
                  <Select
                    placeholder="Выберите пост"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={allPosts?.map((item) => ({
                      label: item.postName,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                {/* Тип статистики*/}
                <Form.Item name="type" label="Отображение статистики">
                  <Select
                    placeholder="Выберите тип отображения"
                    options={viewStatistic}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="isActive" label="Состояние статистики">
                  <Select
                    disabled={false}
                    placeholder="Выберите тип"
                    options={typeStatistic}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Описание статистики*/}
            <Form.Item
              name="description"
              label="Описание статистики"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите описание статистики",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Введите описание" />
            </Form.Item>
          </Form>
        </div>
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid #f0f0f0" }}>
        <Flex justify="flex-end" gap="middle">
          <Button type="primary" onClick={handleSave} loading={isSaving}>
            Сохранить
          </Button>
          <Button onClick={handleReset}>Отменить</Button>
        </Flex>
      </div>
    </Drawer>
  );
};
