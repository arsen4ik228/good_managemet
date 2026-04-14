// VkAuth.tsx
import { useEffect, useRef, useState } from "react";
import {socketUrl, baseUrl } from "../../../helpers/constants";
import { setUserId } from "../../../store/slices/local.storage.slice";
import {useDispatch} from "react-redux";
import {isMobile} from "react-device-detect";
import { io } from "socket.io-client";

// Генерация fingerprint (уникальный идентификатор устройства/браузера)
const generateFingerprint = () => {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
    ];

    const fingerprint = components.join('||');
    // Простое хеширование для получения строки фиксированной длины
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

// Генерация случайной строки для code_verifier
const generateCodeVerifier = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const length = Math.floor(Math.random() * (128 - 43 + 1) + 43);
    let verifier = '';

    for (let i = 0; i < length; i++) {
        verifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return verifier;
};

// Генерация code_challenge из code_verifier методом SHA-256
const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Url = btoa(String.fromCharCode(...hashArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return base64Url;
};

// Генерация случайного state
const generateState = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Сохранение PKCE параметров в sessionStorage
const savePKCEParams = (verifier, state, fingerprint) => {
    sessionStorage.setItem('vk_code_verifier', verifier);
    sessionStorage.setItem('vk_state', state);
    sessionStorage.setItem('vk_fingerprint', fingerprint);
};

// Получение сохраненных PKCE параметров
const getPKCEParams = () => {
    return {
        codeVerifier: sessionStorage.getItem('vk_code_verifier'),
        state: sessionStorage.getItem('vk_state'),
        fingerprint: sessionStorage.getItem('vk_fingerprint'),
    };
};

// Очистка PKCE параметров
const clearPKCEParams = () => {
    sessionStorage.removeItem('vk_code_verifier');
    sessionStorage.removeItem('vk_state');
    sessionStorage.removeItem('vk_fingerprint');
};


export const VkAuth = ({fingerprint}) => {
    const dispatch = useDispatch();
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentFingerprint = useRef(null);

    // Добавляем состояние для данных от сокета
    const [data, setData] = useState({
        accessToken: "",
        refreshTokenId: "",
        userId: "",
    });

    // Создаем сокет
    const socketRef = useRef(null);

    // Эффект для обработки данных от сокета (аналогично AuthPage)
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

    // Эффект для инициализации сокета и VK ID
    useEffect(() => {
        // Очищаем старые PKCE параметры при монтировании
        clearPKCEParams();

        // Генерируем fingerprint один раз при загрузке компонента
        const fingerprint = generateFingerprint();
        currentFingerprint.current = fingerprint;

        // Инициализация сокета
        if (!socketRef.current) {
            socketRef.current = io(`${socketUrl}auth`, {
                cors: {
                    credentials: true,
                },
                transports: ["websocket"],
            });
        }

        const socket = socketRef.current;

        // Обработчики сокета
        const handleRequestInfo = () => {
            if (currentFingerprint.current) {
                socket.emit("responseFromClient", {
                    fingerprint: currentFingerprint.current,
                    userAgent: navigator.userAgent,
                    token: null, // Для VK токен может быть другим
                });
            }
        };

        const handleAuthInfo = (authData) => {
            console.log("Auth info from socket:", authData);
            setData(authData);
        };

        const handleDisconnect = () => {
            console.log("Socket disconnected");
        };

        // Подключаем обработчики
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("requestInfo", handleRequestInfo);
        socket.on("receiveAuthInfo", handleAuthInfo);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        // Загружаем VK ID SDK
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js";
        script.async = true;

        script.onload = async () => {
            if (!window.VKIDSDK) return;

            const VKID = window.VKIDSDK;

            try {
                const codeVerifier = generateCodeVerifier();
                const codeChallenge = await generateCodeChallenge(codeVerifier);
                const state = generateState();

                savePKCEParams(codeVerifier, state, fingerprint);

                VKID.Config.init({
                    app: 54543761,
                    redirectUrl: "https://drained-unplanned-salsa.ngrok-free.dev",
                    responseMode: VKID.ConfigResponseMode.Callback,
                    source: VKID.ConfigSource.LOWCODE,
                    codeChallenge: codeChallenge,
                    codeChallengeMethod: "S256",
                    state: state,
                    scope: "email phone",
                });

                const oneTap = new VKID.OneTap();

                oneTap
                    .render({
                        container: containerRef.current,
                        showAlternativeLogin: true,
                    })
                    .on(VKID.WidgetEvents.ERROR, (err) => {
                        console.error("VK ID Error:", err);
                        setError("Ошибка при инициализации VK ID");
                        setIsLoading(false);
                    })
                    .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload) => {
                        setIsLoading(true);
                        setError(null);

                        const { code, device_id, state: responseState } = payload;

                        const { state: savedState, codeVerifier: savedVerifier, fingerprint: savedFingerprint } = getPKCEParams();

                        if (responseState !== savedState) {
                            setError("Ошибка верификации: state не совпадает");
                            setIsLoading(false);
                            clearPKCEParams();
                            return;
                        }

                        if (!savedVerifier) {
                            setError("Ошибка: code_verifier не найден");
                            setIsLoading(false);
                            return;
                        }

                        if (!savedFingerprint) {
                            setError("Ошибка: fingerprint не найден");
                            setIsLoading(false);
                            return;
                        }

                        try {
                            const response = await fetch(`${baseUrl}auth/login/vk`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    code: code,
                                    device_id: device_id,
                                    state: responseState,
                                    code_verifier: savedVerifier,
                                    fingerprint: savedFingerprint,
                                }),
                            });

                            if (response.ok) {
                                const userData = await response.json();

                                localStorage.setItem("accessToken", userData.token);
                                localStorage.setItem("userId", userData.id);
                                localStorage.setItem("fingerprint", currentFingerprint.current);

                                if (dispatch && setUserId) {
                                    dispatch(setUserId(userData.id));
                                }

                                clearPKCEParams();
                                window.history.replaceState({}, document.title, window.location.pathname);

                                let path = '#/accountSettings';
                                if (localStorage.getItem("lastVisitedPath")) {
                                    path = `#${localStorage.getItem("lastVisitedPath")}`;
                                }
                                window.location.href = path;

                                console.log("✅ VK авторизация успешна:", userData);
                            } else {
                                const errorData = await response.json();
                                console.error("❌ VK auth failed:", errorData);
                                setError(errorData.message || "Не удалось войти через ВКонтакте");
                                setIsLoading(false);
                                clearPKCEParams();
                            }
                        } catch (err) {
                            console.error("Auth error:", err);
                            setError(err.message || "Ошибка при авторизации");
                            setIsLoading(false);
                        }
                    });
            } catch (err) {
                console.error("Initialization error:", err);
                setError("Ошибка инициализации VK ID");
            }
        };

        script.onerror = () => {
            setError("Не удалось загрузить VK ID SDK");
        };

        document.body.appendChild(script);

        // Cleanup
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            if (socketRef.current) {
                socketRef.current.off("connect");
                socketRef.current.off("requestInfo");
                socketRef.current.off("receiveAuthInfo");
                socketRef.current.off("disconnect");
                socketRef.current.off("connect_error");
                socketRef.current.disconnect();
            }
            clearPKCEParams();
        };
    }, [dispatch]);

    return (
        <div style={{ position: 'relative' }}>
            <div ref={containerRef} />
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 1000,
                    fontSize: '14px'
                }}>
                    Авторизация через ВКонтакте...
                </div>
            )}
            {error && (
                <div style={{
                    color: '#ff4444',
                    fontSize: '14px',
                    marginTop: '10px',
                    textAlign: 'center',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};