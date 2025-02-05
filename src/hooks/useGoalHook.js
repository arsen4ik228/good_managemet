import { useGetGoalQuery, usePostGoalMutation, useUpdateGoalMutation } from "../store/services/index";

export const useGoalHook = () => {

    const {
        currentGoal = {},
        isErrorGetGoal,
        isLoadingGetGoal,
        isFetchingGetGoal,
    } = useGetGoalQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            currentGoal: data?.currentGoal || {},
            isErrorGetGoal: isError,
            isLoadingGetGoal: isLoading,
            isFetchingGetGoal: isFetching,
        }),
    });

    const [updateGoal, { isLoading: isLoadingUpdateGoalMutation, isSuccess: isSuccessUpdateGoalMutation, isError: isErrorUpdateGoalMutation, error: ErrorUpdateGoalMutation }] = useUpdateGoalMutation();

    const [postGoal, { isLoading: isLoadingPostPoliciesMutation, isSuccess: isSuccessPostPoliciesMutation, isError: isErrorPostPoliciesMutation, error: ErrorPostPoliciesMutation }] = usePostGoalMutation();


    return {
        currentGoal,
        isErrorGetGoal,
        isLoadingGetGoal,
        isFetchingGetGoal,

        updateGoal,
        isLoadingUpdateGoalMutation,
        isSuccessUpdateGoalMutation,
        isErrorUpdateGoalMutation,
        ErrorUpdateGoalMutation,

        postGoal,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation

    }
}