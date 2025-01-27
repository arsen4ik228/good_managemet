import React, { useState, useEffect } from "react";
import style from "./AuthorizationPage.module.css"; // Ваши стили
// import telegram from "../../../image/telegram.svg"; 
import telegram from '../Custom/icon/telegram.svg'
import logo from '../Custom/icon/logo.svg'
import { io } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { baseUrl } from "../../BLL/constans";

//5000
const socket = io(`${baseUrl}auth`, {
  cors: {
    credentials: true
  },transports : ['websocket']
}); 
// Подключение к сокету

export default function AuthorizationPage() {
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
          }
        );
        const serverData = await response.json();

        if (serverData.isLogged) {
          window.location.href = `#/Main`;
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
      fetch(`${baseUrl}auth/set-cookie`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
        body: JSON.stringify({ refreshTokenId: data.refreshTokenId }),
        credentials: "include", // Включение отправки куки
      })
        .then((response) => {
          if (response.ok) {
            console.log("Куки установлены");
            window.location.href = `#/Main`;
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
        <>
            <div className={style.Container}>
                <div className={style.background}></div>
                <div className={style.logoContainer}>
                    <img src={logo} alt='logo' />
                </div>

                <div className={style.textContainer}>
                    <img src={telegram} alt="Telegram" />
                    <a href={qrUrl} target="_blank" rel="noopener noreferrer" className={style.link}>Войти через Telegram</a>
                    {/* <Link to="6ac81119-f508-48ec-9d4a-6fb3328731c6"> <div>ВОЙТИ</div> </Link> */}
                    {/* <div>{data.sessionId}</div>        */}

                </div>
            </div>
        </>
    )
}
