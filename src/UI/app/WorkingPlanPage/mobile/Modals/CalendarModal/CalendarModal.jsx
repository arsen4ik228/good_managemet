import React from "react";
import { isMobile } from "react-device-detect"; // Импортируем функцию для определения устройства
import MobileLayout from "./mobileLayout/MobileLayout";
import DesktopLayout from "./desktopLayout/DesktopLayout";

export default function CalendarModal(props) {
  return (
    <>
      {isMobile ? (
        <MobileLayout {...props}></MobileLayout>
      ) : (
        <DesktopLayout {...props}></DesktopLayout>
      )}
    </>
  );
}
