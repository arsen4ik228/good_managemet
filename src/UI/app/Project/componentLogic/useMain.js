import React, { useState, useRef } from "react";
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

  const refProject = useRef(null);
  const refPrograma = useRef(null);

  const [openHint, setOpenHint] = useState(false);

  const steps = [
    {
      title: "Проекты",
      description: "Нажмите и выберите справа тип проекта",
      target: () => refProject.current,
    },
    {
      title: "Программы",
      description: "Нажмите и выберите справа тип программы",
      target: () => refPrograma.current,
    },
    {
      title: "Настройки (проекты или программы)",
      description: "Нажмите и отредактируйте",
      target: () => document.querySelector('[data-tour="setting-button"]'),
      disabled: !document.querySelector('[data-tour="setting-button"]'),
    },
    {
      title: "Создать",
      description: "Нажмите для создания стратегии",
      target: () => document.querySelector('[data-tour="create-button"]'),
      disabled: !document.querySelector('[data-tour="create-button"]'),
    },
    {
      title: "Сохранить",
      description: "Нажмите для сохранения",
      target: () => document.querySelector('[data-tour="save-button"]'),
      disabled: !document.querySelector('[data-tour="save-button"]'),
    },
  ].filter((step) => {
    if (step.target.toString().includes("querySelector")) {
      return !step.disabled;
    }
    return true;
  });

  const items = [
    {
      ref: refPrograma,
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
      ref: refProject,
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

    refProject,
    refPrograma,
    openHint,
    setOpenHint,
    steps,
  };
}
