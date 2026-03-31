import React from 'react';
import classes from './Test.module.css';
import default_avatar from '@image/default_avatar.svg'


export default function Test() {
  return (
    <>
        <div className={classes.wrapper}>
            <div className={classes.greySection}></div>
            <div className={classes.whiteSection}></div>

            <div className={classes.contentContainer}>
              <div className={classes.photoSection}>
                <img src={default_avatar} alt="avatar" />
              </div>
              <div className={classes.textSection}>
                <div className={classes.upperText}> Подразделение №32</div>
                <div className={classes.bottomText}>
                  <div>ИМя Фамилия</div>
                  <div>должность</div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}
