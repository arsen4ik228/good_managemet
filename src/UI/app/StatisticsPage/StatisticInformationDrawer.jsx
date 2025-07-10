import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Splitter,
  Row,
  Col,
  Flex,
  message,
} from "antd";

import { useAllPosts, useUpdateSingleStatistic } from "@hooks";

import StatisticTable from "./StatisticTable";

const { TextArea } = Input;

const typeStatistic = [
  { value: "Прямая", label: "Прямая" },
  { value: "Обратная", label: "Обратная" },
];

export const StatisticInformationDrawer = ({
  openDrawer,
  setOpenDrawer,
  statisticId,
  dataSource,
  setDataSource,
  createPoints,
  setCreatePoints,
  setDatePoint,
  chartType,

  currentStatistic,
  isLoadingGetStatisticId,
  isFetchingGetStatisticId,

  handleResetTable,
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const [createCorellationPoints, setCreateCorellationPoints] = useState([]);

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
      const DataArray = {};

      if (createCorellationPoints.length > 0) {
        DataArray.statisticDataCreateDtos = createCorellationPoints.map(
          ({ id, ...rest }) => ({ ...rest })
        );
      }

      const statisticDataUpdateDtos = dataSource.filter(
        (item) => item.isChanged === true
      );

      if (statisticDataUpdateDtos.length > 0) {
        DataArray.statisticDataUpdateDtos = statisticDataUpdateDtos.map(
          ({ id, value, correlationType, ...rest }) => ({
            _id: id,
            value,
            correlationType,
          })
        );
      }

      setIsSaving(true);
      const response = await form.validateFields();
      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...DataArray,
        ...response,
      }).unwrap();

      message.success("Данные успешно обновлены!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error("Ошибка при обновлении.");
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setCreateCorellationPoints([]);
      setDataSource((prev) => prev.map(({ isChanged, ...rest }) => rest));
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    handleResetTable();
    setCreateCorellationPoints([]);
    form.setFieldsValue({
      name: currentStatistic?.name ?? null,
      description: currentStatistic?.description ?? null,
      postId: currentStatistic?.post?.id ?? null,
      type: currentStatistic?.type ?? null,
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
    };

    form.setFieldsValue(initialValues);
  }, [currentStatistic, isLoadingGetStatisticId, isFetchingGetStatisticId]);

  // 1. Первоначальная установка даты при монтировании
  useEffect(() => {
    const calculateInitialDate = () => {
      const currentDate = localStorage.getItem("reportDay");
      if (currentDate !== null) {
        const targetDay = parseInt(currentDate, 10);
        const today = new Date();
        const todayDay = today.getDay();

        let diff = todayDay - targetDay;
        if (diff < 0) diff += 7;

        const lastTargetDate = new Date(today);
        lastTargetDate.setDate(today.getDate() - diff);

        return lastTargetDate.toISOString().split("T")[0];
      }
      return null;
    };

    setDatePoint(calculateInitialDate());
  }, []);

  return (
    <Drawer
      title="Данные о статистике"
      placement="left"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      mask={false}
      width={"500px"}
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
        <Splitter layout="vertical">
          <Splitter.Panel>
            <div style={{ overflowX: "hidden" }}>
              <Form
                form={form}
                onValuesChange={handlePostValuesChange}
                layout="vertical"
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
                          option?.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={allPosts?.map((item) => ({
                          label: item.postName,
                          value: item.id,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    {/* Тип статистики*/}
                    {/* <Form.Item name="type" label="Тип статистики">
                      <Select
                        placeholder="Выберите тип"
                        options={typeStatistic}
                      />
                    </Form.Item> */}
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
          </Splitter.Panel>

          <Splitter.Panel>
            <StatisticTable
              selectedStatisticId={currentStatistic?.id}
              dataSource={dataSource}
              setDataSource={setDataSource}
              createPoints={createPoints}
              setCreatePoints={setCreatePoints}
              chartType={chartType}
              createCorellationPoints={createCorellationPoints}
              setCreateCorellationPoints={setCreateCorellationPoints}
            ></StatisticTable>
          </Splitter.Panel>
        </Splitter>
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
