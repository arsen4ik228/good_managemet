import { useGetConvertsQuery, usePostConvertMutation, useGetConvertIdQuery, useSendMessageMutation } from "../store/services/index"


export const useConvertsHook = ({convertId = null, contactId = null } = {}) => {

    const {
        data: allConvertsAndContactInfo = [],
        isLoading: isLoadingGetConverts,
        isError: isErrorGetConverts,
        isFetching: isFetchingGetConvert,
        refetch: refetchGetConverts,
    } = useGetConvertsQuery({ contactId }, { skip: !contactId });

    const {
        currentConvert = {},
        messages = [],
        senderPostId,
        userInfo = {},
        senderPostForSocket = {},
        senderPostName,
        refetch: refetchGetConvertId,
        isLoadingGetConvertId
    } = useGetConvertIdQuery({ convertId }, {
        selectFromResult: ({ data, isError, isFetching, isLoading, refetch }) => ({
            currentConvert: data?.currentConvert || {},
            messages: data?.messages || [],
            userInfo: data?.userInfo || {},
            senderPostId: data?.senderPostId || null,
            senderPostName: data?.senderPostName || null,
            senderPostForSocket: data?.senderPostForSocket || {},
            isLoadingGetConvertId : isLoading,
            refetch, // Добавляем refetch в результат
        }),
        skip: !convertId
    });

    const [
        postConvert,
        {
            isLoading: isLoadingPostPoliciesMutation,
            isSuccess: isSuccessPostPoliciesMutation,
            isError: isErrorPostPoliciesMutation,
            error: ErrorPostPoliciesMutation,
        }
    ] = usePostConvertMutation()

    const [
        sendMessage,
    ] = useSendMessageMutation()

    return {
        allConverts: allConvertsAndContactInfo?.allConverts,
        contactInfo: allConvertsAndContactInfo?.contactInfo,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        refetchGetConverts,

        currentConvert,
        messages,
        userInfo,
        senderPostId,
        senderPostName,
        senderPostForSocket,
        refetchGetConvertId,
        isLoadingGetConvertId,

        sendMessage,

        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,
    }
}