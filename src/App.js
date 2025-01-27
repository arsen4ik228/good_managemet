import "./App.css";
import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
//ygugjygyjgyg
import MobileApp from "./mobile/MobileApp";
import AppDesktop from "./desktop/AppDesktop";

function App() {
  console.log(
    "mobile                                                        ",
    isMobile
  );
  return (
    <div className="App">
      {isMobile ? <MobileApp /> : <AppDesktop />}
      {/* {isMobile ? <AppDesktop /> : <MobileApp />} */}
    </div>
  );
}

export default App;
