import React, { useState, useEffect } from "react";
import classes from "./Content.module.css"; // Ваши стили
import { QRCode } from "antd";
import { io } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { isMobile } from "react-device-detect";
import { socketUrl, baseUrl } from "@helpers/constants";
import telegram from '@Custom/icon/telegram.svg'
import logo from '@Custom/icon/logo.svg'

const socket = io(`${socketUrl}auth`, {
  cors: {
    credentials: true,
  },
  transports: ["websocket"],
}); // Подключение к сокету

export default function Content() {

  const [data, setData] = useState({
    accessToken: "",
    refreshTokenId: "",
    userId: "",
  });

  const [tokenForTG, setTokenForTG] = useState("");
  const [socketId, setSocketId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [ip, setIp] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const userAgent = navigator.userAgent; // Получение User-Agent

  const a = { _ip: "", _fingerprint: "" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Параллельное выполнение запросов для IP и Fingerprint
        const [ipResponse, fp] = await Promise.all([
          fetch("https://api.ipify.org?format=json").then((res) => res.json()),
          FingerprintJS.load().then((fp) => fp.get()),
        ]);

        // Обновляем объект `a` и состояние
        a._ip = ipResponse.ip;
        a._fingerprint = fp.visitorId;

        setIp(ipResponse.ip);
        setFingerprint(fp.visitorId);

        console.log("IP-адрес:", a._ip);
        console.log("Fingerprint ID:", a._fingerprint);

        // Запрос на сервер
        const response = await fetch(
          `${baseUrl}?fingerprint=${a._fingerprint}`,
          {
            method: "GET",
            headers: {
              "User-Agent": userAgent,
            },
            credentials: "include" // Максик
          }
        );
        const serverData = await response.json();

        if (serverData.isLogged && localStorage.getItem("accessToken")) {
          localStorage.setItem("fingerprint", fp.visitorId);
          window.location.href = isMobile ? `#/Main` : "#/pomoshnik/start";
        }
        console.log("Ответ от /:", serverData);
        setTokenForTG(serverData.tokenForTG);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();

    // Подключение к сокету
    console.log("Попытка подключения к сокету...");
    socket.on("connect", () => {
      console.log("Сокет подключен, socket.id:", socket.id);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Сокет отключен.");
    });

    // Очистка при размонтировании компонента
    return () => {
      console.log("Отключаем сокет...");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  // Эффект для отправки данных после того, как все зависимости будут установлены
  useEffect(() => {
    if (fingerprint && ip && tokenForTG) {
      // Все данные готовы, подписываемся на событие requestInfo и отправляем
      socket.on("requestInfo", (data) => {
        console.log("Получено событие requestInfo:", data);
        // Отправляем ответ через responseFromClient
        console.log("--------------------");
        console.log(fingerprint);
        console.log(userAgent);
        console.log(ip);
        console.log(tokenForTG);
        console.log("--------------------");

        localStorage.setItem("fingerprint", fingerprint);

        socket.emit("responseFromClient", {
          fingerprint: fingerprint,
          userAgent: userAgent,
          ip: ip,
          token: tokenForTG,
        });
      });

      socket.on("receiveAuthInfo", (authData) => {
        console.log("Получено событие receiveAuthInfo:", authData);
        // Обработка полученных данных
        setData(authData);
      });
    }
  }, [fingerprint, ip, tokenForTG]); // Зависимости эффекта

  // Перенаправление на другую страницу при наличии userId
  useEffect(() => {
    if (data.userId && data.userId !== "false") {
      // Сохраняем accessToken в localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId)
      fetch(`${baseUrl}auth/set-cookie`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
        body: JSON.stringify({ refreshTokenId: data.refreshTokenId }),
        credentials: "include", // Включение отправки куки
      })
        .then((response) => {
          if (response.ok) {
            console.log("Куки установлены");
            window.location.href = isMobile ? `#/Main` : `#/pomoshnik/start`;
          } else {
            console.error("Ошибка установки куки");
            alert("Не удалось выполнить аутентификацию. Попробуйте снова.");
          }
        })
        .catch((error) => {
          console.error("Ошибка при установке куки:", error);
          alert("Не удалось установить соединение с сервером.");
        });
    }
  }, [data]);

  // Установка QR-кода при наличии tokenForTG и socketId
  useEffect(() => {
    if (tokenForTG && socketId) {
      setQrUrl(
        `tg://resolve?domain=GMAuthBot&start=${encodeURIComponent(
          tokenForTG
        )}-${encodeURIComponent(socketId)}`
      );
    }
  }, [socketId, tokenForTG]);

  return (
    isMobile ? (
      <div className={classes.Container}>
        <div className={classes.logoContainer}>
          <img src={logo} alt='logo' />
        </div>
        <div className={classes.textContainer}>
          <img src={telegram} alt="Telegram" />
          <a href={qrUrl} target="_blank" rel="noopener noreferrer" className={classes.linkMobile}>
            Войти через Telegram
          </a>
        </div>
      </div>
    ) : (
      <div className={classes.body}>
        <span className={classes.text}>Для входа отсканируйте QR-код</span>
        <div className={classes.QR}>
          {!socketId ? (
            <div>Подключение к сокету...</div>
          ) : tokenForTG && qrUrl ? (
            <div className={classes.telegram}>
              <QRCode errorLevel="H" value={qrUrl} />
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                Или перейдите по ссылке
              </a>
            </div>
          ) : (
            <>Подождите</>
          )}
        </div>
      </div>
    )
  );
}
