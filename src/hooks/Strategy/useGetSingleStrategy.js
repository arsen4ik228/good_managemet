import { useGetStrategyIdQuery } from "@services/index";

export const useGetSingleStrategy = (strategyId) => {
  const {
    currentStrategy = {},
    currentStrategyState = "",
    isLoadingStrategyId,
    isFetchingStrategyId,
    isErrorStrategyId,
    refetch: refetchStrategy
  } = useGetStrategyIdQuery(
    { strategyId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching, refetch }) => ({
        currentStrategy: data?.currentStrategy || {},
        currentStrategyState: data?.currentStrategyState || "",
        isLoadingStrategyId: isLoading,
        isFetchingStrategyId: isFetching,
        isErrorStrategyId: isError,
        refetchStrategy: refetch
      }),
      skip: !strategyId,
    }
  );

  return {
    currentStrategy,
    currentStrategyState,
    isLoadingStrategyId,
    isFetchingStrategyId,
    isErrorStrategyId,
    refetchStrategy,
  };
};
