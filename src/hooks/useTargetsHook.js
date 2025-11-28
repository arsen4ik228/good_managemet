import { useDeleteTargetMutation, useGetArchiveTargetsQuery, useGetTargetsQuery, usePostTargetsMutation, useUpdateTargetsMutation } from "../store/services/index"

export const useTargetsHook = () => {

    const {
        personalTargets = [],
        orderTargets = [],
        projectTragets = [],
        futureTargets = [],
        sendedTargets = [],
        futureSendedTargets = [],
        userPosts = [],
        isLoadingGetTargets,
        isErrorGetTargets,
    } = useGetTargetsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, }) => ({
            personalTargets: data?.personalTargets || [],
            orderTargets: data?.orderTargets || [],
            projectTragets: data?.projectTargets || [],
            futureTargets: data?.futureTargets || [],
            sendedTargets: data?.sendedTargets || [],
            futureSendedTargets: data?.futureSendedTargets || [],
            userPosts: data?.userPosts || [],
            isLoadingGetTargets: isLoading,
            isErrorGetTargets: isError,
        }),
    })

    const {
        archivePersonalTargets = [],
        archiveOrdersTargets = [],
        archiveProjectTragets = [],
        isLoadingGetArchiveTargets,
        isErrorGetArchiveTargets,
    } = useGetArchiveTargetsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, }) => ({
            archivePersonalTargets: data?.personalArchiveTargets || [],
            archiveOrdersTargets: data?.ordersArchiveTargets || [],
            archiveProjectTragets: data?.projectArchiveTargets || [],
            isLoadingGetArchiveTargets: isLoading,
            isErrorGetArchiveTargets: isError,
        }),
    })

    const [
        postTargets,
        {
            isLoading: isLoadingPostTargetsMutation,
            isSuccess: isSuccessPostTargetsMutation,
            isError: isErrorPostTargetsMutation,
            error: ErrorPostTargetsMutation,
        },
    ] = usePostTargetsMutation();

    const [
        updateTargets,
        {
            isLoading: isLoadingUpdateTargetsMutation,
            isSuccess: isSuccessUpdateTargetsMutation,
            isError: isErrorUpdateTargetsMutation,
            error: ErrorUpdateTargetsMutation,
        }
    ] = useUpdateTargetsMutation()

    const [
        deleteTarget,
        {
            isLoading: isLoadingDeleteTargetsMutation,
            isSuccess: isSuccessDeleteTargetsMutation,
            isError: isErrorDeleteTargetsMutation,
            error: ErrorDeleteTargetsMutation,
        }
    ] = useDeleteTargetMutation()

    return {
        // getTargets
        personalTargets,
        orderTargets,
        projectTragets,
        futureTargets,
        sendedTargets,
        futureSendedTargets,
        userPosts,
        isLoadingGetTargets,
        isErrorGetTargets,

        //getArchiveTargets
        archivePersonalTargets,
        archiveOrdersTargets,
        archiveProjectTragets,
        isLoadingGetArchiveTargets,
        isErrorGetArchiveTargets,

        //postTargets
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation,

        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,

        deleteTarget,
        isLoadingDeleteTargetsMutation,
        isSuccessDeleteTargetsMutation,
        isErrorDeleteTargetsMutation,
        ErrorDeleteTargetsMutation,
    }
}