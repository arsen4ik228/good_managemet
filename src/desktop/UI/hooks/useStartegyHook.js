import useGetReduxOrganization from "./useGetReduxOrganization";
import {
  useGetStrategyIdQuery,
  useGetStrategiesQuery,
  usePostStrategyMutation,
  useUpdateStrategyMutation,
} from "@BLL/strategy/strategyApi";
import { useMutationHandler } from "./useMutationHandler";

export default function useStartegyHook(strategyId) {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    activeAndDraftStrategies = [],
    archiveStrategies = [],
    activeStrategyId,
    hasDraftStrategies,
    isLoadingStrategies,
    isErrorStrategies,
  } = useGetStrategiesQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        archiveStrategies: data?.archiveStrategies || [],
        activeAndDraftStrategies: data?.activeAndDraftStrategies || [],
        activeStrategyId: data?.activeStrategyId,
        hasDraftStrategies: data?.hasDraftStrategies,
        isLoadingStrategies: isLoading,
        isErrorStrategies: isError,
      }),
    }
  );

  const [
    postStrategy,
    {
      isLoading: isLoadingPostStrategyMutation,
      isSuccess: isSuccessPostStrategyMutation,
      isError: isErrorPostStrategyMutation,
      error: errorPostStrategyMutation,
      reset: resetPostStrategyMutation,
    },
  ] = usePostStrategyMutation();

  const {
    currentStrategy = {},
    currentStrategyState = "",
    isLoadingStrategyId,
    isFetchingStrategyId,
    isErrorStrategyId,
  } = useGetStrategyIdQuery(
    { strategyId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStrategy: data?.currentStrategy || {},
        currentStrategyState: data?.currentStrategyState || "",
        isLoadingStrategyId: isLoading,
        isFetchingStrategyId: isFetching,
        isErrorStrategyId: isError,
      }),
      skip: !strategyId,
    }
  );

  const [
    updateStrategy,
    {
      isLoading: isLoadingUpdateStrategyMutation,
      isSuccess: isSuccessUpdateStrategyMutation,
      isError: isErrorUpdateStrategyMutation,
      error: errorUpdateStrategyMutation,
      reset: resetUpdateStrategyMutation,
    },
  ] = useUpdateStrategyMutation();

  const localIsResponseUpdateStrategyMutation = useMutationHandler(
    isSuccessUpdateStrategyMutation,
    isErrorUpdateStrategyMutation,
    resetUpdateStrategyMutation
  );

  const localIsResponsePostStrategyMutation = useMutationHandler(
    isSuccessPostStrategyMutation,
    isErrorPostStrategyMutation,
    resetPostStrategyMutation
  );

  return {
    reduxSelectedOrganizationId,

    // Получить все стратегии
    activeAndDraftStrategies,
    archiveStrategies,
    activeStrategyId,
    hasDraftStrategies,
    isLoadingStrategies,
    isErrorStrategies,

    // Создать стратегию
    postStrategy,
    isLoadingPostStrategyMutation,
    isSuccessPostStrategyMutation,
    isErrorPostStrategyMutation,
    errorPostStrategyMutation,
    resetPostStrategyMutation,
    localIsResponsePostStrategyMutation,

    // Получить стратегию по id
    currentStrategy,
    currentStrategyState,
    isLoadingStrategyId,
    isFetchingStrategyId,
    isErrorStrategyId,

    // Обновить стратегию
    updateStrategy,
    isLoadingUpdateStrategyMutation,
    isSuccessUpdateStrategyMutation,
    isErrorUpdateStrategyMutation,
    errorUpdateStrategyMutation,
    resetUpdateStrategyMutation,
    localIsResponseUpdateStrategyMutation,
  };
}
