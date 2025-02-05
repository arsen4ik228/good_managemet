import React from "react";
import { Button, Result } from "antd";

export default function ErrorPage() {
  const handleButtonClick = () => {
    window.location.href = "#/";
  };

  return (
    <Result
      status="403"
      title="401"
      subTitle="Вы не авторизованы"
      extra={
        <Button type="primary" onClick={handleButtonClick}>
          Авторизоваться
        </Button>
      }
    />
  );
}
