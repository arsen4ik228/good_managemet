import { useState, useRef } from "react";
import { Button } from 'antd'
import { useRightPanel, usePanelPreset } from "@hooks";
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer";
import ViewProject from './View/ViewProject.jsx'
import EditProject from "./Edit/EditProject.jsx";
import PopoverForViewSections from "./components/popover/PopoverForViewSections.jsx";

const STATES = {
  VIEW: "view",
  EDIT: "edit",
};

const initialSections = [
  { name: 'Информация', isView: false },
  { name: 'Продукт', isView: true },
  { name: 'Метрика', isView: false },
  { name: 'Организационные мероприятия', isView: false },
  { name: 'Правила', isView: false },
  { name: 'Задача', isView: true },
];

export default function ProjectPage() {
  // const { PRESETS } = useRightPanel();
  // usePanelPreset(PRESETS["STRATEGY"]);

  const [currentState, setCurrentState] = useState(STATES.EDIT);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [sections, setSections] = useState(initialSections);

  const toggleSection = (name) => {
    setSections(prev =>
      prev.map(section =>
        section.name === name
          ? { ...section, isView: !section.isView }
          : section
      )
    );
  };

  const config = {
    [STATES.VIEW]: {
      btns: [
        {
          text: "редактировать",
          click: () => { setCurrentState(STATES.EDIT) },
        },
      ],
      component: <ViewProject />,
    },

    [STATES.EDIT]: {
      btns: [
        {
          text: "выйти",
          click: () => { setCurrentState(STATES.VIEW) },
        },
        {
          text: "начать выполнение",
          click: () => { },
        },
      ],
      popover: (
        <PopoverForViewSections
          sections={sections}
          onToggle={toggleSection}
          isOpen={popoverVisible}
          onClose={() => setPopoverVisible(false)}
        >
          <Button onClick={() => setPopoverVisible(true)}>
            отобразить разделы
          </Button>
        </PopoverForViewSections>
      ),
      component: (
        <EditProject
          sections={sections} 
        />
      ),
    },
  };

  const { btns, component, popover } = config[currentState];

  return (
    <MainContentContainer buttons={btns} popoverButton={popover}>
      {component}
    </MainContentContainer>
  );
}