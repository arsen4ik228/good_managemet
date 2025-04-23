import React from "react";
import { isMobile } from "react-device-detect";


import ProjectMobileDesktopLayout from "@app/Project/mobile/Project/Project";
import ProgramMobileDesktopLayout from "@app/Project/mobile/Program/Program";

const ProjectDesktopLayout = React.lazy(() =>
  import("@app/Project/desktop//Project/Project")
);
const ProgramDesktopLayout = React.lazy(() =>
  import("@app/Project/desktop//Program/Program")
);


export default function useMain() {
  const [activeTab, setActiveTab] = React.useState("программы");
  const [activeTabTypes, setActiveTabTypes] = React.useState("projects");
  const [activeTabTypesProgram, setActiveTabTypesProgram] =
    React.useState("programs");

  const items = [
    {
      key: "программы",
      label: "Программы",
      children: (
        <>
          {isMobile ? (
            <ProgramMobileDesktopLayout
              activeTabTypesProgram={activeTabTypesProgram}
              disabledTable={activeTabTypesProgram === "archivesPrograms"}
            />
          ) : (
            <ProgramDesktopLayout
              activeTabTypesProgram={activeTabTypesProgram}
              disabledTable={activeTabTypesProgram === "archivesPrograms"}
            />
          )}
        </>
      ),
    },
    {
      key: "проекты",
      label: "Проекты",
      children: (
        <>
          {isMobile ? (
            <ProjectMobileDesktopLayout
              activeTabTypes={activeTabTypes}
              disabledTable={
                activeTabTypes === "archivesProjects" ||
                activeTabTypes === "archivesProjectsWithProgram"
              }
            />
          ) : (
            <ProjectDesktopLayout
              activeTabTypes={activeTabTypes}
              disabledTable={
                activeTabTypes === "archivesProjects" ||
                activeTabTypes === "archivesProjectsWithProgram"
              }
            />
          )}
        </>
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

  return {
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
  };
}
