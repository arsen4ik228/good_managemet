import { useGetStatisticsIdWithoutStatisticDataQuery } from "@services/index";

export const useGetSingleStatisticWithoutStatisticData = ({
  statisticId = null,
} = {}) => {
  
  const {
    currentStatistic = {},
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetStatisticsIdWithoutStatisticDataQuery(
    { statisticId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStatistic: data?.currentStatistic || {},
        isLoadingGetStatisticId: isLoading,
        isErrorGetStatisticId: isError,
        isFetchingGetStatisticId: isFetching,
      }),
      skip: !statisticId,
    }
  );

  return {
    currentStatistic,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  };
};
