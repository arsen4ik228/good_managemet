import { useGetOrganizationsQuery } from "@services";

export function useOrganizationHook() {
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
  return {
    organizations,
    isLoadingOrganization,
    isErrorOrganization,
  };
}
