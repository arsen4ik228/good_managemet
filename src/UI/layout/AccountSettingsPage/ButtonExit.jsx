import React from 'react'
import { usePostLogoutMutation } from "@services";

import { LoginOutlined } from '@ant-design/icons';
import { FloatButton, Tooltip } from 'antd';

export default function ButtonExit() {

    const [postLogout] = usePostLogoutMutation();

    const handleButtonClickExit = async () => {
        try {

            const fingerprint = localStorage.getItem("fingerprint");


            if (!fingerprint) {
                throw new Error("Fingerprint not found");
            }


            const result = await postLogout({ fingerprint });

            // Проверяем, была ли ошибка (альтернативный способ)
            if ("error" in result) {
                throw result.error;
            }

            // 3. Очистка клиентских данных
            localStorage.clear();
            indexedDB.deleteDatabase("ControlPanelDB");
            indexedDB.deleteDatabase("DraftDB");
            // 4. Перенаправление на страницу входа
            window.location.href = "/gm/";
        } catch (error) {
            console.error("Logout error:", error);

            // Более продвинутая обработка ошибок
            const errorMessage =
                error instanceof Error ? error.message : "Произошла неизвестная ошибка";

            // Можно использовать toast или другое уведомление вместо alert
            alert(`Ошибка при выходе: ${errorMessage}`);
        }
    };

    return (
        <Tooltip placement="left" title={"Выйти из приложения"} >
            <FloatButton icon={<LoginOutlined />} type="primary" onClick={() => handleButtonClickExit()} style={{ insetInlineEnd: "25vw" }} />
        </Tooltip>
    )
}
