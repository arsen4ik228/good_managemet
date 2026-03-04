import s from '../HolderPostId.module.css';
import default_avatar from "@image/default_avatar.svg";
import {baseUrl} from "@helpers/constants.js";

export default function HolderPostIdForReadOnly({posts, holderPostId}) {

    const user = posts?.find(p => p.id === holderPostId)?.user || null;

    return (
        <img
            src={user?.avatar_url ? `${baseUrl}${user.avatar_url}` : default_avatar}
            alt="avatar"
            className={s.avatar}
        />
    );
}
