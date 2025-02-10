import {
  useGetStatisticsIdQuery,
  useGetStatisticsQuery,
  usePostStatisticsMutation,
  useUpdateStatisticsMutation,
  useUpdateStatisticsToPostIdMutation,
} from "../store/services/index";
import { useGetReduxOrganization } from "@hooks";
import { useMutationHandler } from "./useMutationHandler";

export const useStatisticsHook = ({
  statisticData = false,
  statisticId = null,
} = {}) => {
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

  const {
    currentStatistic = {},
    statisticDatas = [],
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetStatisticsIdQuery(
    { statisticId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStatistic: data?.currentStatistic || {},
        statisticDatas: data?.statisticDatas || [],
        isLoadingGetStatisticId: isLoading,
        isErrorGetStatisticId: isError,
        isFetchingGetStatisticId: isFetching,
      }),
      skip: !statisticId,
    }
  );

  const [
    updateStatistics,
    {
      isLoading: isLoadingUpdateStatisticMutation,
      isSuccess: isSuccessUpdateStatisticMutation,
      isError: isErrorUpdateStatisticMutation,
      error: ErrorUpdateStatisticMutation,
      reset: resetUpdateStatisticsMutation,
    },
  ] = useUpdateStatisticsMutation();

  const localIsResponseUpdateStatisticsMutation = useMutationHandler(
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    resetUpdateStatisticsMutation
  );

  const [
    postStatistics,
    {
      isLoading: isLoadingPostStatisticMutation,
      isSuccess: isSuccessPostStatisticMutation,
      isError: isErrorPostStatisticMutation,
      error: ErrorPostStatisticMutation,
      reset: resetPostStatisticsMutation,
    },
  ] = usePostStatisticsMutation();

  const localIsResponsePostStatisticsMutation = useMutationHandler(
    isSuccessPostStatisticMutation,
    isErrorPostStatisticMutation,
    resetPostStatisticsMutation
  );

  const [
    updateStatisticsToPostId,
    {
      isLoading: isLoadingStatisticsToPostIdMutation,
      isSuccess: isSuccessUpdateStatisticsToPostIdMutation,
      isError: isErrorUpdateStatisticsToPostIdMutation,
      error: ErrorUpdateStatisticsToPostIdMutation,
      reset: resetUpdateStatisticsToPostIdMutation,
    },
  ] = useUpdateStatisticsToPostIdMutation();

  const localIsResponseUpdateStatisticsToPostIdMutation = useMutationHandler(
    isSuccessUpdateStatisticsToPostIdMutation,
    isErrorUpdateStatisticsToPostIdMutation,
    resetUpdateStatisticsToPostIdMutation
  );

  return {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,

    currentStatistic,
    statisticDatas,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,

    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,

    postStatistics,
    isLoadingPostStatisticMutation,
    isSuccessPostStatisticMutation,
    isErrorPostStatisticMutation,
    ErrorPostStatisticMutation,
    localIsResponsePostStatisticsMutation,

    updateStatisticsToPostId,
    isLoadingStatisticsToPostIdMutation,
    isSuccessUpdateStatisticsToPostIdMutation,
    isErrorUpdateStatisticsToPostIdMutation,
    ErrorUpdateStatisticsToPostIdMutation,
    localIsResponseUpdateStatisticsToPostIdMutation
  };
};
