import { useState } from "react";
import { useRightPanel, usePanelPreset } from "@hooks";
import MainContentContainer from "../../Custom/MainContentContainer/MainContentContainer";
import ViewProject from './View/ViewProject.jsx'
import EditProject from "./Edit/EditProject.jsx";

const STATES = {
  VIEW: "view",
  EDIT: "edit",
};

export default function ProjectPage() {
  // const { PRESETS } = useRightPanel();
  // usePanelPreset(PRESETS["STRATEGY"]);

  const [currentState, setCurrentState] = useState(STATES.EDIT);

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
          click: () => {setCurrentState(STATES.VIEW)},
        },
        {
          text: "начать выполнение",
          click: () => { },
        },
        { text: "отобразить разделы", click: () => { } },
      ],
      component: <EditProject />,
    },
  };

  const { btns, component } = config[currentState];

  return (
    <MainContentContainer buttons={btns}>
      {component}
    </MainContentContainer>
  );
}
