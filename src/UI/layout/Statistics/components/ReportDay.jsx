import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Select, message } from "antd";

import { useUpdateSingleOrganization } from "@hooks";

const days = [
  { value: 0, label: "Воскресенье" },
  { value: 1, label: "Понедельник" },
  { value: 2, label: "Вторник" },
  { value: 3, label: "Среда" },
  { value: 4, label: "Четверг" },
  { value: 5, label: "Пятница" },
  { value: 6, label: "Суббота" },
];

export default function ReportDay() {
  const [reportDay, setReportDay] = useState(null);
  const [tempDay, setTempDay] = useState(null);
  const [visible, setVisible] = useState(false);

  const {
    updateOrganization,
    isLoadingUpdateOrganizationMutation,
  } = useUpdateSingleOrganization();

  useEffect(() => {
    const savedDay = localStorage.getItem("reportDay");
    if (savedDay !== null) {
      setReportDay(Number(savedDay));
    }
  }, []);

  const handleSave = async () => {
    if (tempDay === null) {
      message.warning("Пожалуйста, выберите день");
      return;
    }

    setReportDay(tempDay);
    localStorage.setItem("reportDay", tempDay);

    try {
      await updateOrganization({
        _id: localStorage.getItem("selectedOrganizationId"),
        reportDay: tempDay,
      }).unwrap();
      message.success("Отчетный день сохранен!");
      setVisible(false);
    } catch (error) {
      console.error("Ошибка обновления организации:", error);
      message.error("Не удалось сохранить отчетный день");
    }
  };

  const handleCancel = () => {
    setTempDay(reportDay); // сброс к текущему значению
    setVisible(false);
  };

  return (
    <Popconfirm
      placement="bottom"
      title={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#888" }}>
            Отчетный день поменяется у всей организации
          </div>
          <Select
            value={tempDay ?? reportDay}
            placeholder="Выберите день недели"
            onChange={(value) => setTempDay(value)}
            options={days}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              type="primary"
              size="small"
              onClick={handleSave}
              loading={isLoadingUpdateOrganizationMutation}
            >
              Сохранить
            </Button>
            <Button size="small" onClick={handleCancel}>
              Отменить
            </Button>
          </div>
        </div>
      }
      open={visible}
      onOpenChange={(open) => setVisible(open)}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <Button>
        Отчетный день :{" "}
        {days.find((d) => d.value === reportDay)?.label ?? "не выбран"}
      </Button>
    </Popconfirm>
  );
}
