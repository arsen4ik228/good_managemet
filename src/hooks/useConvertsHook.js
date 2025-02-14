import { useGetConvertsQuery, usePostConvertMutation } from "../store/services/index"


export const useConvertsHook = () => {

    const {
        allConverts = [],
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
    } = useGetConvertsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            allConverts: data || [],
            isErrorGetConverts: isError,
            isLoadingGetConverts: isLoading,
            isFetchingGetConvert: isFetching,
        })
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

    return {
        allConverts,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        
        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,
    }
}