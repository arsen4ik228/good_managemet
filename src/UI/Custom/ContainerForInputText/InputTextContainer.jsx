import React, { useState } from 'react';
import classes from './InputTextContainer.module.css';
import sendIcon from '@Custom/icon/send.svg';
import shareIcon from '@Custom/icon/subbar _ share.svg';
import calenderIcon from '@Custom/icon/icon _ calendar.svg';
import attachIcon from '@Custom/icon/subbar _ attach.svg';
import { notEmpty, resizeTextarea } from '@helpers/helpers';
import CalendarModal from '../../app/WorkingPlanPage/mobile/Modals/CalendarModal/CalendarModal';
import FilesModal from '../../app/WorkingPlanPage/mobile/Modals/FilesModal/FilesModal';

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
        const value = e.target.value

        setContentInput(value)
        resizeTextarea(idTextarea)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.body}>
                    <div className={classes.choosePostContainer}>
                        <select
                            name="choosePost"
                            onChange={selectPost}
                        >
                            {senderPostName && (
                                <option>{senderPostName}</option>
                            )}
                            {userPosts?.map((item, index) => (
                                <option key={index} value={`${item.id} ${item.organization}`}>{item.postName}</option>
                            ))}
                        </select>
                    </div>
                    <div className={classes.inputTextContainer}>
                        <div className={classes.buttonSection}>
                            <div>
                                {!offAttachIcon && (
                                    <img src={attachIcon} alt="attachIcon" onClick={() => setOpenFilesModal(true)} />
                                )}
                            </div>
                            <div>
                                {!offSetDate && (
                                    <img src={calenderIcon} alt="calenderIcon" onClick={() => setOpenCalendarModal(true)} />
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
                            <div>

                                {!offShareIcon && (
                                    <img src={shareIcon} alt="shareIcon" onClick={shareClick} />
                                )}
                            </div>
                            <div>
                                <img src={sendIcon} alt="sendIcon" onClick={sendClick} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {openCalendarModal && (
                <CalendarModal
                    setOpenModal={setOpenCalendarModal}
                    dateStart={startDate}
                    setDateStart={setStartDate}
                    dateDeadline={deadlineDate}
                    setDateDeadline={setDeadlineDate}
                    disableDateStart={disableDateStart}
                />
            )}

            {openFilesModal && (
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
            )}

        </>
    );
}