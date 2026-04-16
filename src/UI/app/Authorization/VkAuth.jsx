import { useEffect, useRef, useState } from "react";
import {baseUrl, CLIENT_ID} from "../../../helpers/constants";
import { setUserId } from "../../../store/slices/local.storage.slice";
import { useDispatch } from "react-redux";

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

export const VkAuth = ({ fingerprint }) => {
    const dispatch = useDispatch();
    const containerRef = useRef(null); // Реф на реальный DOM-элемент
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Проверяем, что fingerprint передан
        if (!fingerprint) {
            console.error("VkAuth: fingerprint не передан от родителя");
            setError("Ошибка инициализации: идентификатор устройства не найден");
            return;
        }

        // Очищаем старые PKCE параметры при монтировании
        clearPKCEParams();

        // Предотвращаем двойную инициализацию в React Strict Mode
        if (isInitialized.current) return;
        isInitialized.current = true;

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
                    app: CLIENT_ID,
                    redirectUrl: "https://drained-unplanned-salsa.ngrok-free.dev",
                    responseMode: VKID.ConfigResponseMode.Callback,
                    source: VKID.ConfigSource.LOWCODE,
                    codeChallenge: codeChallenge,
                    codeChallengeMethod: "S256",
                    state: state,
                    scope: "email phone",
                });

                const oneTap = new VKID.OneTap();

                // Рендерим виджет в реальный DOM-элемент, а не в строковый ref
                oneTap.render({
                    container: containerRef.current, // Передаём DOM-узел
                    showAlternativeLogin: true,
                });

                oneTap.on(VKID.WidgetEvents.ERROR, (err) => {
                    console.error("VK ID Error:", err);
                    setError("Ошибка при инициализации VK ID");
                    setIsLoading(false);
                });

                oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload) => {
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
                            localStorage.setItem("fingerprint", fingerprint);

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

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            clearPKCEParams();
        };
    }, [fingerprint, dispatch]);

    return (
        <div style={{ position: 'relative' }}>
            {/* Пустой div, в который VK SDK встроит свой виджет */}
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