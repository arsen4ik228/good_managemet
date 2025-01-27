import { useDeleteTargetMutation, useGetArchiveTargetsQuery, useGetTargetsQuery, usePostTargetsMutation, useUpdateTargetsMutation } from "../BLL/targetsApi"

export const useTargetsHook = () => {

    const {
        currentPersonalTargets = [],
        currentOrdersTargets = [],

        otherTargets = [],
        projectTragets = [],
        userPosts = [],
        isLoadingGetTargets,
        isErrorGetTargets,
    } = useGetTargetsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, }) => ({
            currentPersonalTargets: data?.personalTargets || [],
            currentOrdersTargets: data?.ordersTargets || [],
            otherTargets: data?.otherTargets,

            projectTragets: data?.projectTargets || [],
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
        currentPersonalTargets,
        currentOrdersTargets,
        otherTargets,
        projectTragets,
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