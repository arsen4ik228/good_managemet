import React, {
  useState,
  useEffect,
} from "react";
import InputTextContainer from "@Custom/ContainerForInputText/InputTextContainer.jsx";
import { usePostsHook } from "@hooks";
import { deleteDraft, loadDraft, saveDraft } from "@helpers/indexedDB";
import { useNavigate } from "react-router-dom";

const Input = ({
  convertId,
  sendMessage,
  convertStatusChange,
  senderPostId,
  senderPostName,
  refetchMessages,
  approveConvert,
  finishConvert,
  isLoadingGetConvertId,
  organizationId,
  loadingRequestStatus
}) => {
  const [contentInputPolicyId, setContentInputPolicyId] = useState("");
  const navigate = useNavigate()

  const [selectedPost, setSelectedPost] = useState();
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deadlineDate, setDeadlineDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [contentInput, setContentInput] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(false);
  const [selectedPostOrganizationId, setSelectedPostOrganizationId] = useState();
  const [files, setFiles] = useState();
  const [unpinFiles, setUnpinFiles] = useState([]);

  const idTextArea = 1002;

  const { userPosts } = usePostsHook();

  const reset = () => {
    setStartDate(new Date().toISOString().split("T")[0]);
    setDeadlineDate(new Date().toISOString().split("T")[0]);
    setContentInput("");
    setSelectedPolicy(false);
    deleteDraft("DraftDB", "drafts", idTextArea);
    setContentInputPolicyId("");
  };


  const transformText = (text, convertStatus) => {
    const statusMessages = {
      approve: 'Приказ согласован: ',
      cancel: 'Приказ отменён: '
    };

    const convertStatusMessage = convertStatus
      ? statusMessages[convertStatus]
      : '';

    if (!contentInputPolicyId) return convertStatusMessage + text;

    const { startChar, str, endChar } = contentInputPolicyId;
    return convertStatusMessage + text?.slice(0, startChar) + str + text?.slice(endChar);
    //    return convertStatusMessage + text?.slice(0, contentInputPolicyId?.startChar) + contentInputPolicyId?.str + text.slice(contentInputPolicyId?.endChar);
  };

  const send = async () => {
    if (contentInput.trim() === "" && files.length === 0) return;
  
    // Удаляем черновик
    deleteDraft("DraftDB", "drafts", idTextArea);
  
    try {
      // Подготовка данных для отправки
      const Data = {};
      if (files && files.length > 0) {
        Data.attachmentIds = files.map((item) => item.id);
      }
  
      // Отправка сообщения
      await sendMessage({
        convertId,
        content: transformText(contentInput, convertStatusChange),
        postId: senderPostId,
        ...Data,
      }).unwrap();
  
      // Если есть convertStatusChange, выполняем дополнительное действие
      if (convertStatusChange) {
        try {
          if (convertStatusChange === 'approve') {
            await approveConvert(convertId);
          } else {
            await finishConvert(convertId);
          }
         
        } catch (error) {
          console.error("Ошибка в approveConvert/finishConvert:", error);
          throw error; // Пробрасываем ошибку дальше
        }
      }
  
      // Сброс состояния
      reset();
  
      // Если нужно вернуться назад после approve
      if (convertStatusChange === 'approve') {
        navigate(-1);
      }
  
    } catch (error) {
      console.error("Ошибка в sendMessage:", error);
      if (error.response) {
        console.error("Детали ошибки:", error.response.data);
      }
      // Можно добавить обработку ошибки (например, показать уведомление)
    }
  };

  useEffect(() => {
    if (userPosts?.length > 0) {
      setSelectedPost(userPosts[0].id);
      setSelectedPostOrganizationId(userPosts[0].organization);
    }
  }, [userPosts]);

  useEffect(() => {
    loadDraft("DraftDB", "drafts", idTextArea, setContentInput);
  }, []);

  useEffect(() => {
    saveDraft("DraftDB", "drafts", idTextArea, contentInput);
  }, [contentInput]);

  return (
    <>
      <InputTextContainer
        userPosts={userPosts}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        startDate={startDate}
        setStartDate={setStartDate}
        deadlineDate={deadlineDate}
        setDeadlineDate={setDeadlineDate}
        contentInput={contentInput}
        setContentInput={setContentInput}
        selectedPolicy={selectedPolicy}
        setSelectedPolicy={setSelectedPolicy}
        selectedPostOrganizationId={selectedPostOrganizationId}
        setSelectedPostOrganizationId={setSelectedPostOrganizationId}
        files={files}
        setFiles={setFiles}
        unpinFiles={unpinFiles}
        setUnpinFiles={setUnpinFiles}
        sendClick={send}
        idTextArea={idTextArea}
        senderPostId={senderPostId}
        senderPostName={senderPostName}
        offSetDate={true}
        offShareIcon={true}
        organizationId={organizationId}
        setContentInputPolicyId={setContentInputPolicyId}
        loadingRequestStatus={loadingRequestStatus}
      />
    </>
  );
};

export default Input;
