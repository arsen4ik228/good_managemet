import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
import DesktopApp from "./desktopRouting/DesktopApp";
import MobileApp from "./mobileRouting/MobileApp";
import { SocketProvider } from "@helpers/SocketContext.js";
import { ConvertFormProvider } from '../contexts/ConvertFormContext.js';


import { useGlobalLoading } from "@hooks";
import Loader from "../UI/Custom/Loader/Loader";


function App() {
  const loading = useGlobalLoading();

  return (
    <>
      {loading && <Loader />}

      <SocketProvider>
        <ConvertFormProvider>
          {isMobile ? <MobileApp /> : <DesktopApp />}
        </ConvertFormProvider>
      </SocketProvider>
    </>
  );
}

export default App;
