import { useGetStatisticsQuery } from "@services/index";
import { useGetReduxOrganization } from "@hooks";

export const useAllStatistics = ({  statisticData = false, isActive } = {}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    statistics = [],
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
    refetch
  } = useGetStatisticsQuery(
    {
      organizationId: reduxSelectedOrganizationId,
      statisticData: statisticData,
     ...(isActive !== undefined && { isActive })
    },
    {
      selectFromResult: ({ data, isError, isFetching, isLoading, refetch }) => ({
        statistics: data || [],
        isLoadingGetStatistics: isLoading,
        isFetchingGetStatistics: isFetching,
        isErrorGetStatistics: isError,
        refetch
      }),
    }
  );

  return {
    statistics,
    refetch,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  };
};
