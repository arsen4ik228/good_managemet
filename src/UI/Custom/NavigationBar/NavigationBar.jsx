// import React from 'react';
// import classes from './NavigationBar.module.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import messageIcon from '@image/message-circle-svgrepo-com.svg';
// import inactiveMessageIcon from '@image/message-inactive.svg';
// import helperIcon from '../icon/icon _ GM.svg';
// import inactiveHelperIcon from '../icon/icon _ GM-inactive.svg';
// //import inactiveHelperIcon from '@image/helper-inactive.svg'; 
// import accountIcon from '@image/account.svg';
// import inactiveAccountIcon from '@image/account-inactive.svg';

// export default function NavigationBar() {
//     const navigate = useNavigate();
//     const location = useLocation(); // Получаем текущий путь

//     return (
//         <footer className={classes.footer}>
//             <div className={classes.navigationContainer}>
//                 {/* Иконка сообщений */}
//                 <div className={classes.imgContainer}>
//                     <img
//                         src={location.pathname === '/Main' ? messageIcon : inactiveMessageIcon}
//                         alt="Сообщения"
//                         onClick={() => navigate('/Main')}
//                     />
//                 </div>

//                 {/* Иконка помощника */}
//                 <div className={classes.imgContainer}>
//                     <img
//                         src={location.pathname === '/pomoshnik/start' ? helperIcon : inactiveHelperIcon}
//                         alt="Помощник"
//                         onClick={() => navigate('/pomoshnik/start')}
//                     />
//                 </div>

//                 {/* Иконка аккаунта */}
//                 <div className={classes.imgContainer}>
//                     <img
//                         src={location.pathname === '/account' ? accountIcon : inactiveAccountIcon}
//                         alt="Аккаунт"
//                         onClick={() => navigate('/account')}
//                     />
//                 </div>
//             </div>
//         </footer>
//     );
// }


import React from 'react';
import classes from './NavigationBar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

// Импорт иконок как компонентов
import { ReactComponent as MessageIcon } from '@image/message-circle-svgrepo-com.svg';
import { ReactComponent as HelperIcon } from '../icon/icon _ GM.svg';
import { ReactComponent as AccountIcon } from '@image/account.svg';

export default function NavigationBar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const tabs = [
        { path: '/Main', Icon: MessageIcon },
        { path: '/pomoshnik/start', Icon: HelperIcon },
        { path: '/account', Icon: AccountIcon }
    ];

    return (
        <nav className={classes.nav}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                    <button
                        key={tab.path}
                        className={`${classes.tab} ${isActive ? classes.active : ''}`}
                        onClick={() => navigate(tab.path)}
                        aria-label={tab.path.replace('/', '')}
                    >
                        <tab.Icon className={classes.icon} />
                    </button>
                );
            })}
        </nav>
    );
}