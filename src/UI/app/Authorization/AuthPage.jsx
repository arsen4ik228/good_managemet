import React, { useState, useEffect, useRef } from "react";
import classes from "./AuthPage.module.css";
import { Button, QRCode } from "antd";
import { io, Socket } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { isMobile } from "react-device-detect";
import { socketUrl, baseUrl } from "@helpers/constants";
import telegram from "@Custom/icon/telegram.svg";
import logo from "@Custom/icon/logo.svg";
import tg from "@image/telegram.svg";
import { useDispatch } from "react-redux";
import { setUserId } from "../../../store/slices/local.storage.slice";
import GM from "@image/labelGM.svg";
import { VkAuth } from "./VkAuth";

export default function AuthPage() {
    const [data, setData] = useState({
        accessToken: "",
        refreshTokenId: "",
        userId: "",
    });

    const [clearCacheVisible, setClearCacheVisible] = useState(false);
    const [tokenForTG, setTokenForTG] = useState("");
    const [socketId, setSocketId] = useState("");
    const [qrUrl, setQrUrl] = useState("");
    const [fingerprint, setFingerprint] = useState("");
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const userAgent = navigator.userAgent;
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const hasSentDataRef = useRef(false);

    // 1. Инициализация сокета (один раз)
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(`${socketUrl}auth`, {
                cors: {
                    credentials: true,
                },
                transports: ["websocket"],
            });

            const socket = socketRef.current;

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
                setSocketId(socket.id);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("connect");
                socketRef.current.off("disconnect");
                socketRef.current.off("connect_error");
                socketRef.current.off("requestInfo");
                socketRef.current.off("receiveAuthInfo");
            }
        };
    }, []);

    // 2. Получение IP и fingerprint (один раз, используем только FingerprintJS)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Получаем IP и профессиональный fingerprint
                const [ipResponse, fp] = await Promise.all([
                    fetch("https://api.ipify.org?format=json").then((res) => res.json()),
                    FingerprintJS.load().then((fp) => fp.get()),
                ]);

                const finalFingerprint = fp.visitorId;
                setFingerprint(finalFingerprint);
                localStorage.setItem("fingerprint", finalFingerprint);

                console.log("IP-адрес:", ipResponse.ip);
                console.log("Fingerprint ID:", finalFingerprint);

                // Проверка авторизации
                const response = await fetch(`${baseUrl}?fingerprint=${finalFingerprint}`, {
                    method: "GET",
                    headers: {
                        "User-Agent": userAgent,
                    },
                    credentials: "include",
                });

                const serverData = await response.json();

                if (serverData.isLogged && localStorage.getItem("accessToken")) {
                    let path = '#/accountSettings';
                    if (localStorage.getItem("lastVisitedPath")) {
                        path = `#${localStorage.getItem("lastVisitedPath")}`;
                    }
                    window.location.href = isMobile ? `#/Main` : `${path}`;
                    return;
                }

                setTokenForTG(serverData.tokenForTG);
                console.log("Ответ от /:", serverData);
            } catch (error) {
                console.error("Ошибка:", error);
            } finally {
                setIsAuthChecked(true);
            }
        };

        fetchData();
    }, [userAgent]);

    // 3. Обработка сокет-событий (после получения fingerprint и tokenForTG)
    useEffect(() => {
        if (!fingerprint || !tokenForTG || !socketRef.current || hasSentDataRef.current) return;

        const socket = socketRef.current;

        const handleRequestInfo = () => {
            if (!hasSentDataRef.current) {
                hasSentDataRef.current = true;
                socket.emit("responseFromClient", {
                    fingerprint: fingerprint,
                    userAgent: userAgent,
                    token: tokenForTG,
                });
            }
        };

        const handleAuthInfo = (authData) => {
            console.log("Auth info from socket:", authData);
            setData(authData);
        };

        const handleDisconnect = () => {
            console.log("Disconnected from server");
        };

        socket.on("requestInfo", handleRequestInfo);
        socket.on("receiveAuthInfo", handleAuthInfo);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("requestInfo", handleRequestInfo);
            socket.off("receiveAuthInfo", handleAuthInfo);
            socket.off("disconnect", handleDisconnect);
        };
    }, [fingerprint, tokenForTG, userAgent]);

    // 4. Обработка успешной авторизации (установка куки и редирект)
    useEffect(() => {
        if (data.userId && data.userId !== "false") {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("userId", data.userId);
            dispatch(setUserId(data.userId));

            fetch(`${baseUrl}auth/set-cookie`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.accessToken}`,
                },
                body: JSON.stringify({ refreshTokenId: data.refreshTokenId }),
                credentials: "include",
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("Куки установлены");
                        let path = '#/accountSettings';
                        if (localStorage.getItem("lastVisitedPath")) {
                            path = `#${localStorage.getItem("lastVisitedPath")}`;
                        }
                        window.location.href = isMobile ? `#/Main` : `${path}`;
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
    }, [data, dispatch]);

    // 5. Генерация QR-кода
    useEffect(() => {
        if (tokenForTG && socketId) {
            setQrUrl(
                `tg://resolve?domain=${process.env.REACT_APP_TG_BOT_URL}&start=${encodeURIComponent(
                    tokenForTG
                )}-${encodeURIComponent(socketId)}`
            );
        }
    }, [socketId, tokenForTG]);

    // 6. Таймер для отображения ошибки
    useEffect(() => {
        const timer = setTimeout(() => {
            if (tokenForTG?.length === 0 && isAuthChecked) {
                console.log("tokenForTG не получен, показываем кнопку сброса");
                setClearCacheVisible(true);
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, [tokenForTG, isAuthChecked]);

    // Mobile версия
    if (isMobile) {
        return (
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
                                e.preventDefault();
                            }
                        }}
                    >
                        Войти через Telegram
                    </a>
                </div>
            </div>
        );
    }

    // Desktop версия
    return (
        <div className={classes.body}>
            <div className={classes.firstContainer}>
                <img src={GM} alt="GM" />
                <div className={classes.title}>GOODMANAGEMENT</div>
                <div className={classes.loader}>
                    <div className={classes.line}></div>
                </div>
                <div className={classes.text}>Войдите в программу удобным для вас способом:</div>
            </div>

            {/* VkAuth - передаем fingerprint из состояния */}
            {/*{fingerprint && <VkAuth fingerprint={fingerprint} />}*/}

            <div className={classes.telegram}>
                {tokenForTG && qrUrl ? (
                    <QRCode errorLevel="H" value={qrUrl} icon={tg} />
                ) : (
                    <QRCode errorLevel="H" icon={tg} status="loading" />
                )}
                {clearCacheVisible && (
                    <div className={classes.clearCacheContainer}>
                        <div>Возникла ошибка. Сбросьте кеш приложения!</div>
                        <Button
                            danger
                            onClick={() => {
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('fingerprint');
                                localStorage.removeItem('userId');
                                localStorage.removeItem("lastVisitedPath");
                                window.location.reload();
                            }}
                        >
                            Сбросить кеш
                        </Button>
                    </div>
                )}
                <div className={classes.text}>Для входа отсканируйте QR-код</div>
                {qrUrl?.length > 0 && (
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