import {
  useGetOrganizationsQuery,
  useGetOrganizationIdQuery,
  useUpdateOrganizationsMutation,
} from "@services";
import { useGetReduxOrganization } from "@hooks";
import { useMutationHandler } from "./useMutationHandler";

export function useOrganizationHook() {
  const { reduxSelectedOrganizationId, reduxSelectedOrganizationReportDay } = useGetReduxOrganization();

  const {
    organizations = [],
    isLoadingOrganization,
    isErrorOrganization,
  } = useGetOrganizationsQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      organizations: data || [],
      isLoadingOrganization: isLoading,
      isErrorOrganization: isError,
    }),
  });

  const {
    currentOrganization = {},
    isLoadingOrganizationId,
    isFetchingOrganizationId,
  } = useGetOrganizationIdQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        currentOrganization: data || {},
        isLoadingOrganizationId: isLoading,
        isFetchingOrganizationId: isFetching,
      }),
      skip:!reduxSelectedOrganizationId,
    }
  );

  const [
    updateOrganization,
    {
      isLoading: isLoadingUpdateOrganizationMutation,
      isSuccess: isSuccessUpdateOrganizationMutation,
      isError: isErrorUpdateOrganizationMutation,
      error: ErrorOrganization,
      reset:resetUpdateOrganizationMutation,
    },
  ] = useUpdateOrganizationsMutation();

  
  const localIsResponseUpdateOrganizationMutation = useMutationHandler(
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    resetUpdateOrganizationMutation
  );

  return {
    reduxSelectedOrganizationId,
    reduxSelectedOrganizationReportDay,

    organizations,
    isLoadingOrganization,
    isErrorOrganization,

    currentOrganization,
    isLoadingOrganizationId,
    isFetchingOrganizationId,

    updateOrganization,
    isLoadingUpdateOrganizationMutation,
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    ErrorOrganization,
    localIsResponseUpdateOrganizationMutation
  };
}
