import { useGetStrategyIdQuery, useGetStrategyQuery, usePostStrategyMutation, useUpdateStrategyMutation } from "../BLL/strategyApi";


export const useStartegyHook = (strategyId) => {


    const {
        activeAndDraftStrategies = [],
        archiveStrategies = [],
        activeStrategyId,
        isLoadingStrategy,
        isErrorStrategy,
    } = useGetStrategyQuery(
        undefined,
        {
            selectFromResult: ({ data, isLoading, isError }) => ({
                archiveStrategies: data?.archiveStrategies || [],
                activeAndDraftStrategies: data?.activeAndDraftStrategies || [],
                activeStrategyId: data?.activeStrategyId,
                isLoadingStrategy: isLoading,
                isErrorStrategy: isError,
            }),
        }
    );

    const [
        postStrategy,
        {
            isLoading: isLoadingPostStrategyMutation,
            isSuccess: isSuccessPostStrategyMutation,
            isError: isErrorPostStrategyMutation,
            error: errorPostStrategyMutation,
        },
    ] = usePostStrategyMutation();

        const {
            currentStrategy = {},
            isLoadingStrategyId,
            isErrorStrategyId
        } = useGetStrategyIdQuery({ strategyId },
            {
                selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                    currentStrategy: data?.currentStrategy || [],
                    isLoadingStrategyId: isLoading,
                    isErrorStrategyId: isError,
                }),
                skip: !strategyId, 
            }
        );
    
        const [
            updateStrategy,
            {
                isLoading: isLoadingUpdateStrategyMutation,
                isSuccess: isSuccessUpdateStrategyMutation,
                isError: isErrorUpdateStrategyMutation,
                error: ErrorStrategyMutation,
            },
        ] = useUpdateStrategyMutation();


    return {
        activeAndDraftStrategies,
        archiveStrategies,
        activeStrategyId,
        isLoadingStrategy,
        isErrorStrategy,

        postStrategy,
        isLoadingPostStrategyMutation,
        isSuccessPostStrategyMutation,
        isErrorPostStrategyMutation,
        errorPostStrategyMutation,

        currentStrategy,
        isLoadingStrategyId,
        isErrorStrategyId,

        updateStrategy,
        isLoadingUpdateStrategyMutation,
        isSuccessUpdateStrategyMutation,
        isErrorUpdateStrategyMutation,
        ErrorStrategyMutation,
    }
}