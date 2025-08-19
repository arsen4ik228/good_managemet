import { useGetStatisticsInControlPanelQuery } from "@services/index";

export const useGetAllStatisticsInControlPanel = ({
  selectedControlPanelId,
  datePoint,
} = {}) => {
  const {
    allStatistics = [],
    statisticsIdsInPanel = [],
    isLoadingGetStatisticsInControlPanel,
    isErrorGetStatisticsInControlPanel,
    isFetchingGetStatisticsInControlPanel,
  } = useGetStatisticsInControlPanelQuery(
    { selectedControlPanelId, datePoint },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        allStatistics: data?.allStatistics || [],
        statisticsIdsInPanel: data?.statisticsIdsInPanel || [],
        isLoadingGetStatisticsInControlPanel: isLoading,
        isErrorGetStatisticsInControlPanel: isError,
        isFetchingGetStatisticsInControlPanel: isFetching,
      }),
      skip: !selectedControlPanelId,
    }
  );

  return {
    allStatistics,
    statisticsIdsInPanel,
    isLoadingGetStatisticsInControlPanel,
    isErrorGetStatisticsInControlPanel,
    isFetchingGetStatisticsInControlPanel,
  };
};
