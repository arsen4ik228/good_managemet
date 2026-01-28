import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
import DesktopApp from "./desktopRouting/DesktopApp";
import MobileApp from "./mobileRouting/MobileApp";
import { SocketProvider } from "@helpers/SocketContext.js";
import { ConvertFormProvider } from '../contexts/ConvertFormContext.js';


import { useGlobalLoading } from "@hooks";
import Loader from "../UI/Custom/Loader/Loader";
import { WorkingPlanProvider } from "../contexts/WorkingPlanContext.js";
import { ProjectProvider } from "../contexts/ProjectFormContext.js";


function App() {
  const loading = useGlobalLoading();

  return (
    <>
      {loading && <Loader />}

      <SocketProvider>
        <ConvertFormProvider>
          <WorkingPlanProvider>
            <ProjectProvider>
              {isMobile ? <MobileApp /> : <DesktopApp />}
            </ProjectProvider>
          </WorkingPlanProvider>
        </ConvertFormProvider>
      </SocketProvider>
    </>
  );
}

export default App;
