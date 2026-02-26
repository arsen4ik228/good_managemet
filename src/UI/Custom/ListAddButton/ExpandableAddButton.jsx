import React, { useState } from 'react'
import classes from './ExpandableAddButton.module.css'
import add from '@image/big_plus.svg'
import ListAddButtom from './ListAddButtom'



export default function ExpandableAddButton({ 
  textButton, 
  onFirstOptionClick, 
  onSecondOptionClick,
  firstOptionText = "Первый вариант",
  secondOptionText = "Второй вариант",
  firstOptionIcon = add, // По умолчанию используем ту же иконку
  secondOptionIcon = add // По умолчанию используем ту же иконку
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMainClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleFirstClick = (e) => {
    e.stopPropagation()
    onFirstOptionClick?.()
    setIsExpanded(false)
  }

  const handleSecondClick = (e) => {
    e.stopPropagation()
    onSecondOptionClick?.()
    setIsExpanded(false)
  }

  return (
    <div className={classes.container}>
      <ListAddButtom 
        textButton={textButton} 
        clickFunc={handleMainClick}
      />
      
      <div className={`${classes.expandableBlock} ${isExpanded ? classes.expanded : ''}`}>
        <div className={classes.optionsRow}>
          <button 
            className={classes.optionButton}
            onClick={handleFirstClick}
          >
            <span className={classes.optionIcon}>
              <img src={firstOptionIcon} alt="" />
            </span>
            <span className={classes.optionText}>{firstOptionText}</span>
          </button>
          
          <button 
            className={classes.optionButton}
            onClick={handleSecondClick}
          >
            <span className={classes.optionIcon}>
              <img src={secondOptionIcon} alt="" />
            </span>
            <span className={classes.optionText}>{secondOptionText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}