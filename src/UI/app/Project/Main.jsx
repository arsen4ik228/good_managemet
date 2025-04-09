import React from "react";
import classes from "./Main.module.css";
import { Tabs } from "antd";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";

const Project = React.lazy(() => import("@app/Project/Project/Project"));

const Program = React.lazy(() => import("@app/Project/Program/Program"));

export default function Main() {
  const [activeTab, setActiveTab] = React.useState("1");
  const [activeTabTypes, setActiveTabTypes] = React.useState("projects");

  const items = [
    {
      key: "1",
      label: "Программы",
      children: <Program />,
    },
    {
      key: "2",
      label: "Проекты",
      children: <Project activeTabTypes={activeTabTypes}/>,
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
      key: "projectsWithProgram",
      label: "проекты с программами",
    },
    {
      key: "archivesProjects",
      label: "архивные проекты",
    },
    {
      key: "archivesProjectsWithProgram",
      label: "архивные проекты с программами",
    },
  ];

  const handleTabChangeTypes = (key) => {
    setActiveTabTypes(key);
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
            tabBarGutter={0}
            tabPosition={"left"}
          />

          <Tabs
            defaultActiveKey="projects"
            items={types.map((item) => ({ ...item}))}
            onChange={handleTabChangeTypes}
            tabBarGutter={50}
            
          />
        </div>
        <BottomHeaders />
      </Headers>

      <div className={classes.main}>{getActiveTabContent()}</div>
    </div>
  );
}
