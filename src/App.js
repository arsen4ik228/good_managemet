import './App.css';
import { isMobile } from 'react-device-detect'; // Импортируем функцию для определения устройства

import MobileApp from './mobile/MobileApp';
import AppDesktop from './desktop/AppDesktop';


function App() {

  return (
    <div className="App">
     {/* {isMobile ? <MobileApp /> : <AppDesktop/>} */}
     <AppDesktop></AppDesktop>
    </div>
  );
}

export default App;
