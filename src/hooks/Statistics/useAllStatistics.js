import { useGetStatisticsQuery } from "@services/index";
import { useGetReduxOrganization } from "@hooks";

export const useAllStatistics = ({  statisticData = false } = {}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    statistics = [],
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  } = useGetStatisticsQuery(
    {
      organizationId: reduxSelectedOrganizationId,
      statisticData: statisticData,
    },
    {
      selectFromResult: ({ data, isError, isFetching, isLoading }) => ({
        statistics: data || [],
        isLoadingGetStatistics: isLoading,
        isFetchingGetStatistics: isFetching,
        isErrorGetStatistics: isError,
      }),
    }
  );

  return {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  };
};
