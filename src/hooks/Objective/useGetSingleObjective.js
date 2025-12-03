import { useGetObjectiveIdQuery } from "@services/index";

export const useGetSingleObjective = (strategyId) => {
  const {
    currentObjective,
    isLoadingGetObjectiveId,
    isErrorGetObjectiveId,
    isFetchingGetObjectiveId,
    refetch: refetchObjective,
  } = useGetObjectiveIdQuery(
    { strategyId },
    {
      selectFromResult: ({
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
      }) => ({
        currentObjective: data?.currentObjective || {},
        isLoadingGetObjectiveId: isLoading,
        isErrorGetObjectiveId: isError,
        isFetchingGetObjectiveId: isFetching,
        refetchObjective: refetch,
      }),
      skip: !strategyId,
    }
  );
  return {
    currentObjective,
    isLoadingGetObjectiveId,
    isErrorGetObjectiveId,
    isFetchingGetObjectiveId,
    refetchObjective,
  };
};
