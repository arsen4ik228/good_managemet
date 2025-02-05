import { useGetSpeedGoalIdQuery, useUpdateSpeedGoalMutation } from "../store/services/index"

export const useObjectiveHook = (selectedStrategyId) => {

        const {
            currentSpeedGoal,
            isArchive,
            isLoadingGetSpeedGoalId,
            isErrorGetSpeedGoalId,
            isFetchingGetSpeedGoalId,
        } = useGetSpeedGoalIdQuery(
            { strategyId: selectedStrategyId },
            {
                selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                    currentSpeedGoal: data?.currentSpeedGoal || {},
                    isArchive: data?.isArchive,
                    isLoadingGetSpeedGoalId: isLoading,
                    isErrorGetSpeedGoalId: isError,
                    isFetchingGetSpeedGoalId: isFetching,
                }),
                skip: !selectedStrategyId,
            }
        );


            const [
                updateSpeedGoal,
                {
                    isLoading: isLoadingUpdateSpeedGoalMutation,
                    isSuccess: isSuccessUpdateSpeedGoalMutation,
                    isError: isErrorUpdateSpeedGoalMutation,
                },
            ] = useUpdateSpeedGoalMutation();

        return {
            currentSpeedGoal,
            isArchive,
            isLoadingGetSpeedGoalId,
            isErrorGetSpeedGoalId,
            isFetchingGetSpeedGoalId,

            updateSpeedGoal,
            isLoadingUpdateSpeedGoalMutation,
            isSuccessUpdateSpeedGoalMutation,
            isErrorUpdateSpeedGoalMutation
        }
}