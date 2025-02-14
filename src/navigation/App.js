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

// import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
// import DesktopApp from "./desktopRouting/DesktopApp";
// import MobileApp from "./mobileRouting/MobileApp";

// import React from 'react';
// import { Button, message, Space } from 'antd';

// function App() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const success = () => {
//     messageApi.open({
//       type: 'success',
//       content: 'This is a success message',
//     });
//   };
//   const error = () => {
//     messageApi.open({
//       type: 'error',
//       content: 'This is an error message',
//     });
//   };
//   const warning = () => {
//     messageApi.open({
//       type: 'warning',
//       content: 'This is a warning message',
//     });
//   };
//   return (
//     <>
//      {contextHolder}
//       <Space>
//         <Button onClick={success}>Success</Button>
//         <Button onClick={error}>Error</Button>
//         <Button onClick={warning}>Warning</Button>
//       </Space>
//   </>
//   );
// }

// export default App;

