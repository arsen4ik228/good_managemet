import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
import DesktopApp from "./desktopRouting/DesktopApp";
import MobileApp from "./mobileRouting/MobileApp";


function App() {

  return (
    <>
      {isMobile ? <MobileApp/> : <DesktopApp />}
    </>
  );
}

export default App;