import React, { useState, useMemo } from "react";

import { Drawer, List, Input, Avatar } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import { useAllStatistics } from "@hooks/Statistics/useAllStatistics";

export default function ListStatisticDrawer({
  open,
  setOpen,
  statisticId,
  setStatisticId,
}) {
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

  const [hoveredItem, setHoveredItem] = useState(null);
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
            }}
          >
            <List.Item.Meta
              style={{ paddingLeft: "5px" }}
              title={
                <span
                  style={{
                    fontWeight: statisticId === item.id ? "600" : "normal",
                    color: statisticId === item.id ? "#1890ff" : "inherit",
                  }}
                >
                  {item.name}
                </span>
              }
              description={
                <>
                  <Avatar
                    ize={64}
                    src={
                      <svg
                        width="20.000000"
                        height="20.000000"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <desc>Created with Pixso.</desc>
                        <defs />
                        <path
                          id="Vector"
                          d="M5 20C4.46 20 3.96 19.78 3.58 19.41C3.21 19.03 3 18.53 3 18L3 8C3 7.46 3.21 6.96 3.58 6.58C3.96 6.21 4.46 6 5 6L9 6L9 4L8 4C7.73 4 7.48 3.89 7.29 3.7C7.1 3.51 7 3.26 7 3L0 3L0 1L7 1C7 0.73 7.1 0.48 7.29 0.29C7.48 0.1 7.73 0 8 0L12 0C12.26 0 12.51 0.1 12.7 0.29C12.89 0.48 13 0.73 13 1L20 1L20 3L13 3C13 3.26 12.89 3.51 12.7 3.7C12.51 3.89 12.26 4 12 4L11 4L11 6L15 6C16.11 6 17 6.9 17 8L17 18C17 18.53 16.78 19.03 16.41 19.41C16.03 19.78 15.53 20 15 20L5 20ZM10 12.28C11.18 12.28 12.13 11.32 12.13 10.14C12.13 8.95 11.18 8 10 8C8.81 8 7.85 8.95 7.85 10.14C7.85 11.32 8.81 12.28 10 12.28ZM5 16.21C5 14.55 8.33 13.71 10 13.71C11.66 13.71 15 14.55 15 16.21L15 17.28C15 17.67 14.67 18 14.28 18L5.71 18C5.32 18 5 17.67 5 17.28L5 16.21Z"
                          fill="#005475"
                          fill-opacity="0.901961"
                          fill-rule="evenodd"
                        />
                      </svg>
                    }
                  />
                  <span style={{ color: "#666" }}>{item.post?.name}</span>
                </>
              }
              avatar={<LineChartOutlined style={{ color: "#1890ff" }} />}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
}
