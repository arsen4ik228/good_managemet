import React, { useEffect, useState } from "react";
import classes from "./Target.module.css";
import remove from "../../Custom/icon/icon _ remove.svg"
import ConfirmRemoveModal from "../../Custom/ConfirmRemoveModal/ConfirmRemoveModal";
import { formattedDate, resizeTextarea } from "../../../BLL/constans";
import ConfirmCompleteModal from "../../Custom/ConfirmCompleteModal/ConfirmCompleteModal";

function Target({ item, isNew, edit, contentSender, workersList, setSelectedWorker, setDeadlineDate, setTargetState, isArchive, requestFunc }) {
  const textareaHeight = 50;
  const [content, setContent] = useState('')

  const [openConfirmRemoveModal, setOpenConfirmRemoveModal] = useState(false)
  const [openConfirmCompleteModal, setOpenConfirmCompleteModal] = useState(false)
  const [worker, SetWorker] = useState()
  const [deadline, setDeadline] = useState()

  useEffect(() => {
    if (!isNew) {
      setContent(item?.content)
      SetWorker(item?.holderUserId)
      setDeadline(item.deadline.slice(0, 10))
      // resizeTextarea(item?.type + item?.orderNumber)
    }
  }, [item, isNew])

  // useEffect(() => {
  //   resizeTextarea(item?.type + item?.orderNumber)
  // }, [content])

  useEffect(() => {
    resizeTextarea(item?.type + item?.orderNumber)
    contentSender(content)
  }, [content])

  const completeTarget = () => {
    if (item?.targetState === 'Завершена' || isArchive) return
    setOpenConfirmCompleteModal(true)
  }

  const removeTarget = () => {
    console.log('item:  ', item)
    setOpenConfirmRemoveModal(true)
  }

  return (
    <>
      <div className={classes.cardContainer}>

        <div className={classes.header}>
          {(!isNew && !edit) && (
            <div className={classes.confirm} onClick={() => completeTarget()}>
              {item?.targetState === 'Завершена' ? 'Задача завершена' : "Завершить задачу"}
              <input
                type="checkbox"
                readOnly
                checked={item.targetState === 'Завершена'}
              />

            </div>
          )}
          {(edit && !isNew && item?.targetState !== 'Отменена') && (
            <div className={classes.remove}>
              <img src={remove} alt="" onClick={removeTarget} />
            </div>
          )}
        </div>
        {isNew ?
          (
            <div className={classes.content}>
              <textarea
                name="content"
                placeholder="Введите текст задачи..."
                id={item?.type + item?.orderNumber}
                value={content}
                style={{ height: `${textareaHeight}px` }}
                onChange={(e) => {
                  setContent(e.target.value)
                  setTimeout(resizeTextarea(item?.type + item?.orderNumber), 0)
                }}
              />
            </div>
          ) : (

            <div className={classes.content}>
              <textarea
                name="content"
                placeholder="Введите текст задачи..."
                id={item.type + item.orderNumber}
                value={content}
                disabled={!edit}
                style={{ height: `${textareaHeight}px` }}
                onChange={(e) => {
                  setContent(e.target.value)
                  setTimeout(resizeTextarea(item.type + item.orderNumber), 0)
                }}
              />
            </div>
          )}
        <div className={classes.bottom}>
          {isNew ? (
            <>
              <div className={classes.worker}>
                <select name="selectWorker" id="1" onChange={(e) => setSelectedWorker(e.target.value)}>
                  <option>Выберите ответственного</option>
                  {workersList?.map((item, index) => (
                    <option key={index} value={item.id}> {item.firstName + ' ' + item.lastName}</option>
                  ))}
                </select>
              </div>
              <div className={classes.deadline}>
                <input type="date" onChange={(e) => setDeadlineDate(e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div className={classes.worker}>
                <select name="selectWorker" id="1" value={worker} disabled={!edit} onChange={(e) => setSelectedWorker(e.target.value)}>
                  <option>Выберите ответственного</option>
                  {workersList?.map((item, index) => (
                    <option key={index} value={item.id}> {item.firstName + ' ' + item.lastName}</option>
                  ))}
                </select>
              </div>
              {(item?.isExpired) ?
                (
                  <div className={classes.deadline}>
                    {/* <input type="date" value={deadline} disabled={!edit} onChange={(e) => setDeadlineDate(e.target.value)} /> */}
                    <span> Просрочено {formattedDate(deadline)} </span>
                  </div>
                ) : (
                  item?.targetState === 'Отменена' ?
                    (
                      <div className={classes.deadline}>
                        {/* <input type="date" value={deadline} disabled={!edit} onChange={(e) => setDeadlineDate(e.target.value)} /> */}
                        <span> Отменена</span>
                      </div>
                    ) : (

                      <div className={classes.deadline}>
                        <input type="date" value={deadline} disabled={!edit} onChange={(e) => setDeadlineDate(e.target.value)} />
                      </div>
                    )
                )}
            </>
          )}
        </div>

      </div>
      {openConfirmRemoveModal &&
        <ConfirmRemoveModal
          setTargetState={setTargetState}
          setOpenModal={setOpenConfirmRemoveModal}
          item={item}
          requestFunc={requestFunc}
        >
        </ConfirmRemoveModal>
      }
      {openConfirmCompleteModal &&
        <ConfirmCompleteModal
          setOpenModal={setOpenConfirmCompleteModal}
          item={item}
          setTargetState={setTargetState}
        >
        </ConfirmCompleteModal>
      }
    </>
  );
}

export default Target;
