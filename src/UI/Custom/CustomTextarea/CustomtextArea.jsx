
import React from 'react'
import classes from './CustomtextArea.module.css'

export default function CustomtextArea({ content, setContent, disabled }) {
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <textarea
            name="customtextArea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={disabled}
          >
          </textarea>
        </div>
      </div>
    </>
  )
}
