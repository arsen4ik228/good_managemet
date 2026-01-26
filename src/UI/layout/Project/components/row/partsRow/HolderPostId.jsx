import { useState } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import s from "./HolderPostId.module.css";
import default_avatar from "@image/default_avatar.svg";
import { Select } from "antd";

export default function HolderPostId({ avatar }) {
  const [showSelect, setShowSelect] = useState(false);

  const user = [
    { id: 1, firstName: "Иван", lastName: "Иванов" },
    { id: 2, firstName: "Пётр", lastName: "Петров" },
    { id: 3, firstName: "Сергей", lastName: "Сергеев" },
    { id: 4, firstName: "Мария", lastName: "Смирнова" },
    { id: 5, firstName: "Анна", lastName: "Кузнецова" },
  ];

  const handleAvatarClick = () => {
    setShowSelect((prev) => !prev);
  };

  const handleSelectChange = (value) => {
    setShowSelect(false);
  };

  return (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <img
            src={avatar || default_avatar}
            alt="avatar"
            className={s.avatar}
            onClick={handleAvatarClick}
            style={{ cursor: "pointer" }}
          />
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className={s.HoverCardContent} sideOffset={5}>
            <img src={avatar || default_avatar} alt="avatar" className={s.avatarCard} />
            <div>Имя</div>
            <div>Фамилия</div>
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
          options={user.map((u) => ({
            label: `${u.firstName} ${u.lastName}`,
            value: u.id,
          }))}
          filterOption={(input, option) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
          onChange={handleSelectChange}
        />
      )}
    </>
  );
}
