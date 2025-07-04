
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
import { Select, Spin } from 'antd';

import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru"); // Устанавливаем русский язык для dayjs
const { Option } = Select;
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
  loadingRequestStatus
}) {

  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [openFilesModal, setOpenFilesModal] = useState(false);
  const [defaultPost, setDefaultPost] = useState(undefined)
  const [selectedValue, setSelectedValue] = useState(null);
  // Инициализация дефолтного значения
  useEffect(() => {
    if (senderPostName) {
      setSelectedValue(senderPostName);
    } else if (userPosts?.length) {
      const defaultPost = userPosts.find(post => post.isDefault);
      if (defaultPost) {
        const value = `${defaultPost.id} ${defaultPost.organization}`;
        setSelectedValue(value);
        setSelectedPost(defaultPost.id);
        setSelectedPostOrganizationId(defaultPost.organization);
      }
    }
  }, [userPosts, senderPostName]);

  const selectPost = (value) => {
    setSelectedValue(value); // Сохраняем выбранное значение
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
            <Select
              name="choosePost"
              onChange={selectPost} // Теперь передаем value напрямую
              data-tour="current-post"
              className={classes.antdSelectOverride}
              placeholder="Выберите пост"
              value={selectedValue}
              dropdownMatchSelectWidth={false}
              style={{ width: '100%' }}
            >
              {senderPostName ? (
                <Option value={senderPostName}>{senderPostName}</Option>
              ) : (
                userPosts?.map((item, index) => (
                  <Option
                    key={index}
                    value={`${item.id} ${item.organization}`}
                  >
                    {item.postName}
                    {item.isDefault && " (ваш пост по умолчанию)"}
                  </Option>
                ))
              )}
            </Select>
          </div>
          <div className={classes.inputTextContainer}>
            <div className={classes.buttonSection}>
              <div className={classes.dialogButton} data-tour="files-attachment">
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
              <div className={classes.dialogButton} data-tour="date-for-task">
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
                disabled={loadingRequestStatus}
              />
              {loadingRequestStatus && (
                <div className={classes.spin}>
                  <Spin size="big" />
                </div>
              )}
            </div>
            <div className={classes.buttonSection}>
              <div className={classes.dialogButton} data-tour="share-icon">
                {!offShareIcon && (
                  <img src={shareIcon} alt="shareIcon" onClick={shareClick} />
                )}
              </div>
              <div className={classes.dialogButton} data-tour="send-message">
                {loadingRequestStatus ? (
                  <Spin size="small" />
                ) : (
                  <img src={sendIcon} alt="sendIcon" onClick={sendClick} />
                )}

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
