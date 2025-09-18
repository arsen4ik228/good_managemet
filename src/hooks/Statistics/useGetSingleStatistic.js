import { useGetStatisticsIdQuery } from "@services/index";

export const useGetSingleStatistic = ({
  statisticId = null,
  datePoint = null,
  viewType = "daily",
} = {}) => {
  
  const {
    currentStatistic = {},
    statisticData = [],
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
    refetch,
  } = useGetStatisticsIdQuery(
    { statisticId, datePoint, viewType },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching, refetch }) => ({
        currentStatistic: data?.currentStatistic || {},
        statisticData: data?.statisticData || [],
        isLoadingGetStatisticId: isLoading,
        isErrorGetStatisticId: isError,
        isFetchingGetStatisticId: isFetching,
        refetch
      }),
      skip: !statisticId || !datePoint,
    }
  );

  return {
    refetch,
    currentStatistic,
    statisticData,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  };
};
