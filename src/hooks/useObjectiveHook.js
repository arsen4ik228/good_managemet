import { useGetObjectiveIdQuery, useUpdateObjectiveMutation } from "../store/services/index.js"

export const useObjectiveHook = (selectedStrategyId) => {

        const {
            currentSpeedGoal,
            isArchive,
            isLoadingGetSpeedGoalId,
            isErrorGetSpeedGoalId,
            isFetchingGetSpeedGoalId,
        } = useGetObjectiveIdQuery(
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
            ] = useUpdateObjectiveMutation();

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