import React from "react";
import classes from "./Main.module.css";

import Header from "@Custom/CustomHeader/Header";
import useMain from "../componentLogic/useMain";

import { Flex, Tabs } from "antd";

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
  } = useMain();

  return (
    <div>
      <div className={classes.wrapper}>
        <Header title={"программы и проекты"}>Личный помощщник</Header>

        <div
          className={classes.body}
          style={{
            position: "fixed",
            width: "calc(100vh - 50px)",
            height: "100vw",
            top: "50px",
            left: 0,
            transform: "rotate(90deg) translateY(-100%)",
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={items.map((item) => ({ ...item, children: null }))}
              onChange={handleTabChange}
              tabBarGutter={5}
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
          <div className={classes.main}>{getActiveTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
