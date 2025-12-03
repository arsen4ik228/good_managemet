import useGetReduxOrganization from "../useGetReduxOrganization";
import { useGetStrategiesQuery } from "@services";


export function useAllStrategy() {
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

  return {
    reduxSelectedOrganizationId,

    activeAndDraftStrategies,
    archiveStrategies,
    activeStrategyId,
    hasDraftStrategies,
    isLoadingStrategies,
    isErrorStrategies,
  };
}
