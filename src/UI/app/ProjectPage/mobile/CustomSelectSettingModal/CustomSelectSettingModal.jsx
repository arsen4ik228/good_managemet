import React from 'react'
import classes from './CustomSelectSettingModal.module.css'
import close from '@Custom/SearchModal/icon/icon _ add.svg'

export default function CustomSelectSettingModal({ setModalOpen, listSelectedSections, setListSelectedSections }) {

  const SECTION_NAMES = [
    { name: 'Описание' },
    { name: 'Организационные мероприятия' },
    { name: 'Правила' },
    { name: 'Метрика' },
  ]

  const selectingSections = (nameSection) => {
    setListSelectedSections((prevState) => {
      if (prevState.includes(nameSection))
        return prevState.filter(item => item !== nameSection)
      else
        return [...prevState, nameSection]
    })
  }

  return (
    <>
      <div
        className={classes.wrapper}
      >
        <div className={classes.column}>
          <div className={classes.close} onClick={() => setModalOpen(false)}>
            <img src={close} alt='close' />
          </div>
          <div className={classes.title}>Разделы</div>
          <div className={classes.list}>
            <ul className={classes.selectList}>
              {SECTION_NAMES.map((item, index) => (
                <li
                  key={index}
                  onClick={() => selectingSections(item.name)}
                >
                  <span>
                    {item.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={listSelectedSections?.includes(item.name)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.btn}>
            <button
              onClick={() => setModalOpen(false)}
            >
              добавить
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
