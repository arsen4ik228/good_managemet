import React from "react";
import classes from "./Main.module.css";
import { Flex, Tabs } from "antd";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";

const Project = React.lazy(() => import("@app/Project/Project/Project"));

const Program = React.lazy(() => import("@app/Project/Program/Program"));



export default function Main() {
  const [activeTab, setActiveTab] = React.useState("программы");
  const [activeTabTypes, setActiveTabTypes] = React.useState("projects");
  const [activeTabTypesProgram, setActiveTabTypesProgram] =
    React.useState("programs");

  const items = [
    {
      key: "программы",
      label: "Программы",
      children: (
        <Program
          activeTabTypesProgram={activeTabTypesProgram}
          disabledTable={activeTabTypesProgram === "archivesPrograms"}
        />
      ),
    },
    {
      key: "проекты",
      label: "Проекты",
      children: (
        <Project
          activeTabTypes={activeTabTypes}
          disabledTable={activeTabTypes === "archivesProjects" || activeTabTypes === "archivesProjectsWithProgram"}
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const getActiveTabContent = () => {
    const activeItem = items.find((item) => item.key === activeTab);
    return activeItem ? activeItem.children : null;
  };

  const types = [
    {
      key: "projects",
      label: "проекты",
    },
    {
      key: "archivesProjects",
      label: "завершенные проекты",
    },
    {
      key: "projectsWithProgram",
      label: "проекты с программами",
    },
    {
      key: "archivesProjectsWithProgram",
      label: "завершенные проекты с программами",
    },
  ];

  const typesProgram = [
    {
      key: "programs",
      label: "программы",
    },
    {
      key: "archivesPrograms",
      label: "завершенные программы",
    },
  ];

  const handleTabChangeTypes = (key) => {
    setActiveTabTypes(key);
  };

  const handleTabChangeTypesProgram = (key) => {
    setActiveTabTypesProgram(key);
  };

  return (
    <div className={classes.dialog}>
      <Headers name={"программы и проекты"}>
        <div
          style={{
            display: "flex",
          }}
        >
          <Tabs
            defaultActiveKey="1"
            items={items.map((item) => ({ ...item, children: null }))}
            onChange={handleTabChange}
            tabBarGutter={10}
            tabPosition={"left"}
          />

          <Flex vertical style={{ width: "100%", overflowX: "auto", overflowY: "hidden"}}>
            <Tabs
              disabled
              defaultActiveKey="program"
              items={typesProgram.map((item) => ({ ...item,  disabled: activeTab === "проекты"}))}
              onChange={handleTabChangeTypesProgram}
              tabBarGutter={50}
              tabBarStyle={{ margin: 0, padding: 0 }}
            />
            <Tabs
              defaultActiveKey="projects"
              items={types.map((item) => ({ ...item, disabled: activeTab === "программы"}))}
              onChange={handleTabChangeTypes}
              tabBarGutter={50}
              tabBarStyle={{ margin: 0, padding: 0 }}
            />
          </Flex>
        </div>
        <BottomHeaders />
      </Headers>

      <div className={classes.main}>{getActiveTabContent()}</div>
    </div>
  );
}
