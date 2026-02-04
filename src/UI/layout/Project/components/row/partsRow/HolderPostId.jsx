import {useState, useRef, useEffect} from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import {Select, Avatar, Flex} from "antd";
import s from './HolderPostId.module.css';
import default_avatar from "@image/default_avatar.svg";
import {baseUrl} from "@helpers/constants.js";

export default function HolderPostId({posts, holderPostId, onChange}) {
    const [showSelect, setShowSelect] = useState(false);
    const containerRef = useRef(null); // реф для select
    const user = posts?.find(p => p.id === holderPostId)?.user || null;

    const handleSelectChange = (_, option) => {
        onChange(option ? option.value : null);
        setShowSelect(false);
    };

    // закрываем при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSelect(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <HoverCard.Root>
                <HoverCard.Trigger>
                    <img
                        src={user?.avatar_url ? `${baseUrl}${user.avatar_url}` : default_avatar}
                        alt="avatar"
                        className={s.avatar}
                        onClick={() => setShowSelect(prev => !prev)}
                        style={{cursor: "pointer"}}
                    />
                </HoverCard.Trigger>
                <HoverCard.Portal>
                    <HoverCard.Content className={s.HoverCardContent} sideOffset={5}>
                        <img
                            src={user?.avatar_url ? `${baseUrl}${user.avatar_url}` : default_avatar}
                            alt="avatar"
                            className={s.avatarCard}
                        />
                        <div>{user?.firstName || "Имя"}</div>
                        <div>{user?.lastName || "Фамилия"}</div>
                    </HoverCard.Content>
                </HoverCard.Portal>
            </HoverCard.Root>

            {showSelect && (
                <div
                    ref={containerRef}
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: "-35px",
                        zIndex: 1000,
                    }}
                >
                    <Select
                        bordered={false}
                        showSearch
                        allowClear
                        optionFilterProp="label"
                        open={true}
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{
                            width: 250,
                            backgroundColor: "#fff",
                            borderRadius: 4
                        }}
                        options={posts?.map(p => ({
                            value: p.id,
                            user: p.user,
                            search: `${p.user?.firstName} ${p.user?.lastName}`.toLowerCase(),
                            label: (
                                <Flex align="center" gap={8}>
                                    <Avatar
                                        size={24}
                                        src={p.user?.avatar_url ? `${baseUrl}${p.user.avatar_url}` : default_avatar}
                                    />
                                    <span style={{
                                        display: "inline-block",
                                        maxWidth: 350,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>{p.user?.firstName} {p.user?.lastName}</span>
                                </Flex>
                            ),
                        }))}
                        filterOption={(input, option) => option?.search?.includes(input.toLowerCase())}
                        onChange={handleSelectChange}
                        value={holderPostId}
                    />
                </div>
            )}
        </>
    );
}
