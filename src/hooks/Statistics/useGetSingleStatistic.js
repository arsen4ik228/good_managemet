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
  } = useGetStatisticsIdQuery(
    { statisticId, datePoint, viewType },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStatistic: data?.currentStatistic || {},
        statisticData: data?.statisticData || [],
        isLoadingGetStatisticId: isLoading,
        isErrorGetStatisticId: isError,
        isFetchingGetStatisticId: isFetching,
      }),
      skip: !statisticId || !datePoint,
    }
  );

  return {
    currentStatistic,
    statisticData,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  };
};
