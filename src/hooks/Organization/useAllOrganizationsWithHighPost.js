import {
    useGetOrganizationsWithHighPostQuery,
} from "@services";

export function useAllOrganizationsWithHighPost() {
  const {
    organizations = [],
    isLoadingOrganization,
    isErrorOrganization,
  } = useGetOrganizationsWithHighPostQuery(undefined, {
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
