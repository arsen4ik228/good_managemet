import React from 'react'
import classes from "./BottomHeaders.module.css"
import ButtonAction from './ButtonAction/ButtonAction'

export default function BottomHeaders({ children, shareFunctionList, refShare, create, update, refUpdate, refCreate }) {
  return (
    <div className={classes.editText}>
      {children}
      <ButtonAction create={create}
        update={update}
        refUpdate={refUpdate}
        refCreate={refCreate}
        shareFunctionList={shareFunctionList}
        refShare={refShare}
      >
      </ButtonAction>
    </div>
  )
}
