import { useGetConvertsQuery, usePostConvertMutation, useGetConvertIdQuery, useSendMessageMutation } from "../store/services/index"


export const useConvertsHook = (convertId) => {

    const {
        data: allConverts = [],
        isLoading: isLoadingGetConverts,
        isError: isErrorGetConverts,
        isFetching: isFetchingGetConvert,
        refetch: refetchGetConverts,
    } = useGetConvertsQuery();

    const {
        currentConvert = {},
        messages = [],
        senderPostId,
        senderPostName,
    } = useGetConvertIdQuery({ convertId }, {
        selectFromResult: ({ data, isError, isFetching, isLoading }) => ({
            currentConvert: data?.currentConvert || {},
            messages: data?.messages || [],
            senderPostId: data?.senderPostId || null,
            senderPostName: data?.senderPostName || null
        }),
        skip: !convertId
    })

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
        allConverts,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        refetchGetConverts,

        currentConvert,
        messages,
        senderPostId,
        senderPostName,

        sendMessage,

        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,
    }
}