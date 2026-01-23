import * as HoverCard from "@radix-ui/react-hover-card";
import s from "./HolderPostId.module.css";
import default_avatar from '@image/default_avatar.svg'

export default function HolderPostId({ avatar }) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <img src={avatar || default_avatar} alt="avatar" className={s.avatar} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className={s.HoverCardContent} sideOffset={5}>
          <img src={avatar || default_avatar} alt="avatar" className={s.avatarCard} />
          <div>Имя</div>
          <div>Фамилия</div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
