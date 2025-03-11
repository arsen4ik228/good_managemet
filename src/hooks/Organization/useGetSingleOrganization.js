import { useGetOrganizationIdQuery } from "@services";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export function useGetSingleOrganization({organizationId = null, enabled = true}) {
  const { reduxSelectedOrganizationId } =
    useGetReduxOrganization();

  const {
    currentOrganization = {},
    isLoadingOrganizationId,
    isFetchingOrganizationId,
  } = useGetOrganizationIdQuery(
    { organizationId: organizationId ?? reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        currentOrganization: data || {},
        isLoadingOrganizationId: isLoading,
        isFetchingOrganizationId: isFetching,
      }),
      skip: !reduxSelectedOrganizationId || !enabled,
    }
  );

  return {
    reduxSelectedOrganizationId,

    currentOrganization,
    isLoadingOrganizationId,
    isFetchingOrganizationId,
  };
}
