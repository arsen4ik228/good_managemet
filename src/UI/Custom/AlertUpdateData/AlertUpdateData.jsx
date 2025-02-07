// import React, { useState, useEffect } from 'react';
// import classes from './AlertUpdateData.module.css';

// const AlertUpdateData = ({ setModalOpen }) => {

//     useEffect(() => {

//     }, [])
//     return (
//         <>
//             <div className={classes.wrapper} onClick={() => setModalOpen(false)}>
//                 <div className={classes.modalContainer}>
//                     <div
//                         className={classes.modalContent}
//                     >
//                         У вас уже есть "Черновик" Cтратегии. <br />
//                         "Черновик" Cтратегии может существовать только один.
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// };

// export default AlertUpdateData;

import React, { useState, useEffect } from 'react';
import classes from './AlertUpdateData.module.css';

const AlertUpdateData = ({ setModalOpen }) => {
    const [autoCloseTimeout, setAutoCloseTimeout] = useState(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setModalOpen(false);
        }, 1000); 

        setAutoCloseTimeout(timeout);

        return () => {
            clearTimeout(timeout);
        };
    }, [setModalOpen]);

    return (
        <>
            <div className={classes.wrapper} onClick={() => setModalOpen(false)}>
                <div className={classes.modalContainer}>
                    <div className={classes.modalContent}>
                        Измените данные!!!
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlertUpdateData;
