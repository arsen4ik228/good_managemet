import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
import MobileApp from "../mobile/MobileApp";
import DesktopApp from "./desktopRouting/DesktopApp";


function App() {

  return (
    <>
      {isMobile ? <MobileApp/> : <DesktopApp />}
    </>
  );
}

export default App;