import React, { useState, useRef } from "react";
import classes from "./Main.module.css";
import { Flex, Tabs } from "antd";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import useMain from "../componentLogic/useMain";

import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";

export default function Main() {
  const {
    activeTab,
    setActiveTab,
    activeTabTypes,
    setActiveTabTypes,
    activeTabTypesProgram,
    setActiveTabTypesProgram,
    items,
    handleTabChange,
    getActiveTabContent,
    types,
    typesProgram,
    handleTabChangeTypes,
    handleTabChangeTypesProgram,

    refProject,
    refPrograma,
    openHint,
    setOpenHint,
    steps,
  } = useMain();

  return (
    <div className={classes.dialog}>
      <Headers
        name={"программы и проекты"}
        funcActiveHint={() => setOpenHint(true)}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <Tabs
            defaultActiveKey="1"
            items={items.map((item) => ({
              ...item,
              children: null,
              label: <div ref={item.ref}>{item.label}</div>,
            }))}
            onChange={handleTabChange}
            tabBarGutter={10}
            tabPosition={"left"}
          />

          <Flex
            vertical
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            <Tabs
              disabled
              defaultActiveKey="program"
              items={typesProgram.map((item) => ({
                ...item,
                disabled: activeTab === "проекты",
              }))}
              onChange={handleTabChangeTypesProgram}
              tabBarGutter={50}
              tabBarStyle={{ margin: 0, padding: 0 }}
            />
            <Tabs
              defaultActiveKey="projects"
              items={types.map((item) => ({
                ...item,
                disabled: activeTab === "программы",
              }))}
              onChange={handleTabChangeTypes}
              tabBarGutter={50}
              tabBarStyle={{ margin: 0, padding: 0 }}
            />
          </Flex>
        </div>
        <BottomHeaders />
      </Headers>

      <ConfigProvider locale={ruRU}>
        <Tour open={openHint} onClose={() => setOpenHint(false)} steps={steps} />
      </ConfigProvider>

      <div className={classes.main}>{getActiveTabContent()}</div>
    </div>
  );
}
