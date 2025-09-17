import { useGetStatisticsForPeriodQuery } from "@services/index";
import { useGetReduxOrganization } from "@hooks";

export const useGetStatisticsForPeriod = ({
  weeks = null,
  isActive = true,
} = {}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    statistics = [],
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  } = useGetStatisticsForPeriodQuery(
    {
      organizationId:reduxSelectedOrganizationId,
      weeks,
      isActive,
    },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
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
