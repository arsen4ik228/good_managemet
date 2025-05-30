
import React, { useState, useEffect } from "react";
import classes from './InputTextContainer.module.css';
import sendIcon from '@Custom/icon/send.svg';
import shareIcon from '@Custom/icon/subbar _ share.svg';
import calenderIcon from '@Custom/icon/icon _ calendar.svg';
import attachIcon from '@Custom/icon/subbar _ attach.svg';
import { notEmpty, resizeTextarea } from '@helpers/helpers';
import CalendarModal from '../../app/WorkingPlanPage/mobile/Modals/CalendarModal/CalendarModal';
import FilesModal from '../../app/WorkingPlanPage/mobile/Modals/FilesModal/FilesModal';
import TextArea from 'antd/es/input/TextArea';


import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru"); // Устанавливаем русский язык для dayjs

export default function InputTextContainer({
  userPosts,
  selectedPost,
  setSelectedPost,
  startDate,
  setStartDate,
  deadlineDate,
  setDeadlineDate,
  contentInput,
  setContentInput,
  selectedPolicy,
  setSelectedPolicy,
  selectedPostOrganizationId,
  setSelectedPostOrganizationId,
  files,
  setFiles,
  unpinFiles,
  setUnpinFiles,
  idTextarea,
  sendClick,
  shareClick,
  senderPostId,
  senderPostName,
  offAttachIcon,
  offSetDate,
  offShareIcon,
  disableDateStart,
  organizationId,
  setContentInputPolicyId,
}) {

  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [openFilesModal, setOpenFilesModal] = useState(false);


  const selectPost = (e) => {
    const value = e.target.value;
    if (value) {
      const [postId, organization] = value.split(' ');
      setSelectedPost(postId);
      setSelectedPostOrganizationId(organization);
    }
  };


  const handleChangeContentTextarea = (e) => {
    const value = e.target.value;
    setContentInput(value);
    resizeTextarea(idTextarea);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Enter' || event.shiftKey || typeof sendClick !== 'function') return;

      event.preventDefault();
      sendClick();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sendClick]);

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.body}>
          <div className={classes.choosePostContainer}>
            <select name="choosePost" onChange={selectPost} data-tour="current-post">
              {senderPostName ? (
                <option>{senderPostName}</option>
              ) : (
                userPosts?.map((item, index) => (
                  <option key={index} value={`${item.id} ${item.organization}`}>
                    {item.postName}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className={classes.inputTextContainer}>
            <div className={classes.buttonSection}>
              <div data-tour="files-attachment">
                {!offAttachIcon && (
                  <FilesModal
                    openModal={openFilesModal}
                    setOpenModal={setOpenFilesModal}
                    policyId={selectedPolicy}
                    setPolicyId={setSelectedPolicy}
                    postOrganizationId={selectedPostOrganizationId}
                    files={files}
                    setFiles={setFiles}
                    unpinFiles={unpinFiles}
                    setUnpinFiles={setUnpinFiles}
                    organizationId={organizationId}
                    setContentInput={setContentInput}
                    setContentInputPolicyId={setContentInputPolicyId}
                  />
                )}
              </div>
              <div data-tour="date-for-task">
                {!offSetDate && (
                  <CalendarModal
                    openModal={openCalendarModal}
                    setOpenModal={setOpenCalendarModal}
                    dateStart={startDate}
                    setDateStart={setStartDate}
                    dateDeadline={deadlineDate}
                    setDateDeadline={setDeadlineDate}
                    disableDateStart={disableDateStart}
                  />
                )}
              </div>
            </div>
            <div className={classes.inputText}>
              <textarea
                id={idTextarea}
                value={contentInput}
                onChange={(e) => handleChangeContentTextarea(e)}
              />
            </div>
            <div className={classes.buttonSection}>
              <div data-tour="share-icon">
                {!offShareIcon && (
                  <img src={shareIcon} alt="shareIcon" onClick={shareClick} />
                )}
              </div>
              <div data-tour="send-message">
                <img src={sendIcon} alt="sendIcon" onClick={sendClick} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {openCalendarModal && (
                <CalendarModal
                    openModal={openCalendarModal}
                    setOpenModal={setOpenCalendarModal}
                    dateStart={startDate}
                    setDateStart={setStartDate}
                    dateDeadline={deadlineDate}
                    setDateDeadline={setDeadlineDate}
                    disableDateStart={disableDateStart}
                />
            )} */}

      {/* {openFilesModal && (
                <FilesModal
                    setOpenModal={setOpenFilesModal}
                    policyId={selectedPolicy}
                    setPolicyId={setSelectedPolicy}
                    postOrganizationId={selectedPostOrganizationId}
                    files={files}
                    setFiles={setFiles}
                    unpinFiles={unpinFiles}
                    setUnpinFiles={setUnpinFiles}
                />
            )} */}
    </>
  );
}
