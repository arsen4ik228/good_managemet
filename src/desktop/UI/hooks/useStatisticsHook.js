import { useGetStatisticsQuery } from "BLL/statisticsApi";
import useGetReduxOrganization from "./useGetReduxOrganization";

export default function useStatisticsHook({ statisticData }) {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();
  const {
    statistics = [],
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
    refetch,
  } = useGetStatisticsQuery(
    {
      organizationId: reduxSelectedOrganizationId,
      statisticData: statisticData,
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
}
