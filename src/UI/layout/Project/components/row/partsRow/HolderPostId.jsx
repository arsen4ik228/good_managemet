import { useState } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Select, Avatar, Flex } from "antd";
import s from './HolderPostId.module.css';
import default_avatar from "@image/default_avatar.svg";
import { baseUrl } from "@helpers/constants.js";

export default function HolderPostId({ posts, holderPostId, onChange }) {
  const [showSelect, setShowSelect] = useState(false);
  const [user, setUser] = useState(posts?.find(p => p.id === holderPostId)?.user || null);

  const handleSelectChange = (_, option) => {
    if (!option) {
      setUser(null);
      onChange(null);
      return;
    }
    setUser(option.user);
    onChange(option.value);
    setShowSelect(false);
  };

  return (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <img
            src={user?.avatar_url ? `${baseUrl}${user.avatar_url}` : default_avatar}
            alt="avatar"
            className={s.avatar}
            onClick={() => setShowSelect(prev => !prev)}
            style={{ cursor: "pointer" }}
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
        <Select
          bordered={false}
          showSearch
          allowClear
          optionFilterProp="label"
          style={{ width: 400 }}
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
      )}
    </>
  );
}
