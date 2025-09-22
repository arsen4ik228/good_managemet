import { useGetConvertsQuery, useGetArchiveConvertsQuery, usePostConvertMutation, useUpdateConvertMutation, useGetConvertIdQuery, useSendMessageMutation, useFinishConvertMutation, useApproveConvertMutation } from "@services"


export const useConvertsHook = ({ convertId = null, contactId = null } = {}) => {

    const {
        data: allConvertsAndContactInfo = [],
        isLoading: isLoadingGetConverts,
        isError: isErrorGetConverts,
        isFetching: isFetchingGetConvert,
        error: ErrorGetConverts,
        refetch: refetchGetConverts,
    } = useGetConvertsQuery({ contactId }, { skip: !contactId });

    const {
        data: archiveConvaerts,
        isLoading: isLoadingGetArchiveConverts,
        isError: isErrorGetArchiveConverts,
        isFetching: isFetchingGetArchiveConvert,
    } = useGetArchiveConvertsQuery({ contactId }, { skip: !contactId });

    const {
        currentConvert = {},
        userIsHost,
        senderPostId,
        userInfo = {},
        senderPostForSocket = {},
        senderPostName,
        watcherPostForSocket,
        recipientPost,
        pathOfUsers = [],
        organizationId,
        refetch: refetchGetConvertId,
        isLoadingGetConvertId,
        isFetchingGetConvartId,
        isErrorGetConvertId,
    } = useGetConvertIdQuery({ convertId }, {
        selectFromResult: ({ data, isError, isFetching, isLoading, refetch }) => ({
            currentConvert: data?.currentConvert || {},
            userIsHost: data?.userIsHost || false,
            userInfo: data?.userInfo || {},
            senderPostId: data?.senderPostId || null,
            senderPostName: data?.senderPostName || null,
            senderPostForSocket: data?.senderPostForSocket || {},
            recipientPost: data?.recipientPost || {},
            pathOfUsers: data?.pathOfUsers || [],
            organizationId: data?.organizationId || null,
            watcherPostForSocket: data?.watcherPostForSocket,
            isLoadingGetConvertId: isLoading,
            refetch, // Добавляем refetch в результат
        }),
        skip: !convertId
    });

    const [
        postConvert,
        {
            isLoading: isLoadingPostConvertMutation,
            isSuccess: isSuccessPostConvertMutation,
            isError: isErrorPostConvertMutation,
            error: ErrorPostConvertMutation,
        }
    ] = usePostConvertMutation()

    const [
        updateConvert,
        {
            isLoading: isLoadingUpdateConvertMutation,
            isSuccess: isSuccessUpdateConvertMutation,
            isError: isErrorUpdateConvertMutation,
            error: ErrorUpdateConvertMutation,
        }
    ] = useUpdateConvertMutation()

    const [
        sendMessage,
        {
            isLoading: isLoadingSendMessages
        }
    ] = useSendMessageMutation()

    const [
        approveConvert
    ] = useApproveConvertMutation()

    const [
        finishConvert,
        {
            isLoading: isLoadingFinishConvertMutation,
            isSuccess: isSuccessFinishConvertMutation,
            isError: isErrorFinishConvertMutation,
            error: ErrorFinishConvertMutation,
        }
    ] = useFinishConvertMutation()

    return {
        seenConverts: allConvertsAndContactInfo?.seenConverts,
        unseenConverts: allConvertsAndContactInfo?.unseenConverts,
        contactInfo: allConvertsAndContactInfo?.contactInfo,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        ErrorGetConverts,
        refetchGetConverts,

        archiveConvaerts,
        isLoadingGetArchiveConverts,
        isErrorGetArchiveConverts,
        isFetchingGetArchiveConvert,

        currentConvert,
        userIsHost,
        userInfo,
        senderPostId,
        senderPostName,
        senderPostForSocket,
        recipientPost,
        organizationId,
        pathOfUsers,
        refetchGetConvertId,
        watcherPostForSocket,
        isLoadingGetConvertId,
        isFetchingGetConvartId,
        isErrorGetConvertId,

        sendMessage,
        isLoadingSendMessages,

        postConvert,
        isLoadingPostConvertMutation,
        isSuccessPostConvertMutation,
        isErrorPostConvertMutation,
        ErrorPostConvertMutation,

        updateConvert,

        approveConvert,
        finishConvert,
        isLoadingFinishConvertMutation,
        isSuccessFinishConvertMutation,
        isErrorFinishConvertMutation,
        ErrorFinishConvertMutation,
    }
}