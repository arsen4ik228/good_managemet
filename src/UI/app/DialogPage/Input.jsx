import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import InputTextContainer from "@Custom/ContainerForInputText/InputTextContainer.jsx";
import { usePostsHook } from "@hooks";
import { deleteDraft, loadDraft, saveDraft } from "@helpers/indexedDB";

const Input = ({
  convertId,
  sendMessage,
  senderPostId,
  senderPostName,
  refetchMessages,
  isLoadingGetConvertId,
  organizationId,
}) => {
  const [contentInputPolicyId, setContentInputPolicyId] = useState();

  const [selectedPost, setSelectedPost] = useState();
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deadlineDate, setDeadlineDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [contentInput, setContentInput] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(false);
  const [selectedPostOrganizationId, setSelectedPostOrganizationId] =
    useState();
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
  };

  const transformText = (text) => {

    console.log("sdhfjsd", text.slice(0, contentInputPolicyId.startChar) + contentInputPolicyId.str + text.slice(contentInputPolicyId.endChar));

    if (contentInputPolicyId.str.length === 0) return text;

    return text.slice(0, contentInputPolicyId.startChar) + contentInputPolicyId.str + text.slice(contentInputPolicyId.endChar);
    
  };

  const send = async () => {
    if (contentInput.trim() === "") return;

    deleteDraft("DraftDB", "drafts", idTextArea);

    const Data = {};

    if (files) Data.attachmentIds = files.map((item) => item.id);

    await sendMessage({
      convertId,
      content: transformText(contentInput),
      postId: senderPostId,
      ...Data,
    })
      .unwrap()
      .then(() => reset())
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
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
        organizationId={organizationId}
        setContentInputPolicyId={setContentInputPolicyId}
      />
    </>
  );
};

export default Input;
