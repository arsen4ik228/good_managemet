import React, { useState, useEffect } from "react";
import classes from "./AuthPage.module.css"; // Ваши стили
import { Button, QRCode } from "antd";
import { io } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { isMobile } from "react-device-detect";
import { socketUrl, baseUrl } from "@helpers/constants";
import telegram from "@Custom/icon/telegram.svg";
import logo from "@Custom/icon/logo.svg";
import tg from "@image/telegram.svg";
import { useDispatch } from "react-redux";
import { setUserId } from "../../../store/slices/local.storage.slice";
import GM from "@image/labelGM.svg"



const socket = io(`${socketUrl}auth`, {
  cors: {
    credentials: true,
  },
  transports: ["websocket"],
}); // Подключение к сокету

export default function AuthPage() {
  const [data, setData] = useState({
    accessToken: "",
    refreshTokenId: "",
    userId: "",
  });

  const [clearCacheVisile, setClearCacheVisible] = useState(false)
  const [tokenForTG, setTokenForTG] = useState("");
  const [socketId, setSocketId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [ip, setIp] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const userAgent = navigator.userAgent; // Получение User-Agent

  const dispatch = useDispatch()

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
            credentials: "include", // Максик
          }
        );
        const serverData = await response.json();

        if (serverData.isLogged && localStorage.getItem("accessToken")) {
          localStorage.setItem("fingerprint", fp.visitorId);
          window.location.href = isMobile ? `#/Main` : "#/accountSettings";
        }
        console.log("Ответ от /:", serverData);
        setTokenForTG(serverData.tokenForTG);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();

    // Подключение к сокету
    if (socket.connected) {
      setSocketId(socket.id);
    } else {
      console.log("Сокет уже подключен, socket.id:", socket.id);
      socket.on("connect", () => {
        console.log("Сокет подключен, socket.id:", socket.id);
        setSocketId(socket.id);
      });
    }

    socket.on("disconnect", () => {
      console.log("Сокет отключен.");
    });

    socket.on("connect_error", (error) => {
      console.error('Socket connection error:', error);
    });

    // Очистка при размонтировании компонента
    return () => {
      //("Отключаем сокет...");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  // Эффект для отправки данных после того, как все зависимости будут установлены
  useEffect(() => {
    if (!fingerprint || !tokenForTG || !ip || !userAgent || !socket) return;
    const handleRequestInfo = (data) => {
      localStorage.setItem("fingerprint", fingerprint);
      socket.emit("responseFromClient", {
        fingerprint: fingerprint,
        userAgent: userAgent,
        ip: ip,
        token: tokenForTG,
      });
    };
    const handleAuthInfo = (authData) => {
      console.log(authData);
      setData(authData);
    };
    const handleDisconnect = () => {
      console.log("Disconnected");
    };
    socket.on("requestInfo", handleRequestInfo);
    socket.on("receiveAuthInfo", handleAuthInfo);
    socket.on("disconnect", handleDisconnect);
    return () => {
      socket.off("requestInfo", handleRequestInfo);
      socket.off("receiveAuthInfo", handleAuthInfo);
      socket.disconnect();
    };
  }, [fingerprint, tokenForTG, ip]);

  // Перенаправление на другую страницу при наличии userId
  useEffect(() => {
    if (data.userId && data.userId !== "false") {
      // Сохраняем accessToken в localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId);
      dispatch(setUserId(data.userId))
      fetch(`${baseUrl}auth/set-cookie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
        body: JSON.stringify({ refreshTokenId: data.refreshTokenId }),
        credentials: "include", // Включение отправки куки
      })
        .then((response) => {
          if (response.ok) {
            console.log("Куки установлены");
            window.location.href = isMobile ? `#/Main` : `#/accountSettings`;
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
  }, [data, tokenForTG]);

  // Установка QR-кода при наличии tokenForTG и socketId
  useEffect(() => {
    console.log('цстановка qr кода socketId - ', socketId, ' token - ', tokenForTG)
    if (tokenForTG && socketId) {
      setQrUrl(
        `tg://resolve?domain=${process.env.REACT_APP_TG_BOT_URL}&start=${encodeURIComponent(
          tokenForTG
        )}-${encodeURIComponent(socketId)}`
      );
    }
  }, [socketId, tokenForTG]);
  console.warn(tokenForTG, ' ----', socket, qrUrl)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tokenForTG.length === 0) {
        console.log('tokenForTG не существует, выполняем действие...');
        setClearCacheVisible(true)
      }
    }, 10000);

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, [tokenForTG]); // Зависимость от tokenForTg


  return isMobile ? (
    <div className={classes.Container}>
      <div className={classes.logoContainer}>
        <img src={logo} alt="logo" />
      </div>
      <div className={classes.textContainer}>
        <img src={telegram} alt="Telegram" />
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.linkMobile}
          aria-disabled={!tokenForTG}
          onClick={(e) => {
            if (!tokenForTG) {
              e.preventDefault(); // Отменяем действие ссылки
            }
          }}
        >
          Войти через Telegram
        </a>
      </div>
    </div>
  ) : (


    <div className={classes.body}>
      {/* <span className={classes.text}>Для входа отсканируйте QR-код</span>
      <div className={classes.QR}>
        {!tokenForTG ? (
          <span className={classes.loader}>
            <img src={icon} alt="icon" />
          </span>
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
          <span className={classes.loader}>
            <img src={icon} alt="icon" />
          </span>
        )}
      </div> */}
      <div className={classes.firstContainer}>
        <img src={GM} alt="GM" />
        <div className={classes.title}>GOODMANAGEMENT</div>
        <div className={classes.loader}>
          <div className={classes.line}></div>
        </div>
        <div className={classes.text}>Войдите в программу удобным для вас способом:</div>
      </div>

      <div className={classes.telegram}>
        {tokenForTG && qrUrl ? (
          <QRCode errorLevel="H" value={qrUrl} icon={tg} />
        ) : (
          <QRCode errorLevel="H" icon={tg} status="loading" />
        )}
        {clearCacheVisile && (
          <div className={classes.clearCacheContainer}>
            <div>Возникла ошибка. Сбросьте кеш приложения!</div>
            <Button
              danger
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('fingerprint');
                localStorage.removeItem('userId');

                window.location.reload();
              }}
            >
              Сбросить кеш
            </Button>
          </div>
        )}
        <div className={classes.text}>Для входа отсканируйте QR-код</div>
        {qrUrl.length > 0 && (
          <a
            href={qrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            Или перейдите по ссылке
          </a>
        )}
      </div>

    </div>


  );
}
