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
        refetch: refetchGetConvertId,
        isLoadingGetConvertId
    } = useGetConvertIdQuery({ convertId }, {
        selectFromResult: ({ data, isError, isFetching, isLoading, refetch }) => ({
            currentConvert: data?.currentConvert || {},
            messages: data?.messages || [],
            senderPostId: data?.senderPostId || null,
            senderPostName: data?.senderPostName || null,
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
        allConverts,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        refetchGetConverts,

        currentConvert,
        messages,
        senderPostId,
        senderPostName,
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