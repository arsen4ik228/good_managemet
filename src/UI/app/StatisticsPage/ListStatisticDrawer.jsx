import React, { useState, useMemo } from "react";

import { Drawer, List, Input, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAllStatistics } from "@hooks/Statistics/useAllStatistics";

export default function ListStatisticDrawer({
  open,
  setOpen,
  statisticId,
  setStatisticId,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Получение всех статистик
  const {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  } = useAllStatistics({
    statisticData: false,
  });

  // Фильтрация статистик по поисковому запросу
  const filteredStatistics = useMemo(() => {
    if (!searchText) return statistics;

    return statistics.filter((item) => {
      const searchLower = searchText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        (item.post?.name && item.post.name.toLowerCase().includes(searchLower))
      );
    });
  }, [statistics, searchText]);

  return (
    <Drawer
      title="Статистики"
      placement="left"
      open={open}
      onClose={() => setOpen(false)}
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
      loading={isLoadingGetStatistics}
    >
      {/* Поле поиска */}
      <div style={{ padding: "16px 16px 0" }}>
        <Input.Search
          placeholder="Поиск по названию или должности"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>
      {/* Список с фильтрацией */}
      <List
        itemLayout="horizontal"
        dataSource={filteredStatistics}
        renderItem={(item) => (
          <List.Item
            onClick={() => setStatisticId(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              cursor: "pointer",
              padding: "12px 16px",
              backgroundColor:
                statisticId === item.id
                  ? "#f0f7ff"
                  : hoveredItem === item.id
                  ? "#f5f5f5"
                  : "transparent",
              transition: "background-color 0.3s",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {/* Avatar слева */}
            <div style={{ marginRight: "16px", flexShrink: 0 }}>
              <UserOutlined
                style={{
                  color: "#1890ff",
                  fontSize: "24px",
                  paddingTop: "4px",
                }}
              />
            </div>

            {/* Контент справа */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: statisticId === item.id ? "600" : "normal",
                  color: statisticId === item.id ? "#1890ff" : "inherit",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                {item.name}
              </div>
              <div style={{ color: "#666", fontSize: "12px" }}>
                {item.post?.name}
              </div>
            </div>
          </List.Item>
        )}
      />
    </Drawer>
  );
}
