import React, { useState } from "react";
import classes from "./PanelDragDrop.module.css";
import { Button, Space, Typography, Popconfirm } from "antd";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalSetting from "../modalSetting/ModalSetting";
import { useModuleActions } from "@hooks";
const { Text } = Typography;

export default function PanelDragDrop({
  provided,
  statistics,
  datePoint,
  updateControlPanel,
  panel,
  deleteFromIndexedDB,
  deleteControlPanel,
  reduxSelectedOrganizationId,
  id,
  name,
  onClick,
  isActive,
}) {


  const { isChange_control_panel } = useModuleActions("control_panel");

  const [hovered, setHovered] = useState(false);

  // отдельные состояния для кнопок
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const removeControlPanel = async () => {
    try {
      await deleteControlPanel({ controlPanelId: id }).unwrap();

      deleteFromIndexedDB(reduxSelectedOrganizationId, id)
        .then(() => {
          //(`Панель управления с id ${id} успешно удалена из IndexedDB.`);
        })
        .catch((error) => {
          console.error("Ошибка при удалении из IndexedDB:", error);
        });
    } catch (error) {
      console.error(
        "Ошибка при удалении панели управления:",
        JSON.stringify(error, null, 2)
      );
    }
  };

  const showActions = hovered || openSettingModal || confirmDeleteOpen;

  return (
    <>
      <div
        {...provided.dragHandleProps}
        className={classes.div}
        style={{
          background: isActive ? "var(--primary)" : "var(--grey)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Text
          onClick={onClick}
          ellipsis
          style={{ color: "white", flex: 1, marginRight: 8 }}
        >
          {name}
        </Text>

        {showActions && isChange_control_panel && (
          <Space size={4}>
            {/* Кнопка "Настройки" */}
            <Button
              type="text"
              icon={<SettingOutlined style={{ color: "white" }} />}
              onClick={(e) => {
                e.stopPropagation();
                setOpenSettingModal(true);
              }}
            />

            {/* Кнопка "Удалить" */}
            <Popconfirm
              title="Удалить панель"
              description="Вы точно хотите удалить?"
              open={confirmDeleteOpen}
              onOpenChange={(visible) => setConfirmDeleteOpen(visible)}
              onConfirm={removeControlPanel}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "white" }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteOpen(true);
                }}
              />
            </Popconfirm>
          </Space>
        )}
      </div>

      {/* Модалка настроек */}
      {openSettingModal && (
        <ModalSetting
          statistics={statistics}
          datePoint={datePoint}
          currentControlPanel={panel}
          updateControlPanel={updateControlPanel}
          exit={() => setOpenSettingModal(false)}
        />
      )}
    </>
  );
}
