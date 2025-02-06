import { useGetGoalQuery, usePostGoalMutation, useUpdateGoalMutation } from "@services";
import { useGetReduxOrganization } from '@hooks'


export const useGoalHook = () => {

    const {reduxSelectedOrganizationId} = useGetReduxOrganization()

    const {
        currentGoal = {},
        isErrorGetGoal,
        isLoadingGetGoal,
        isFetchingGetGoal,
    } = useGetGoalQuery({organizationId: reduxSelectedOrganizationId}, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            currentGoal: data?.currentGoal || {},
            isErrorGetGoal: isError,
            isLoadingGetGoal: isLoading,
            isFetchingGetGoal: isFetching,
        }),
    });
    console.log(currentGoal)
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