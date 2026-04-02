import {
    useGetOrganizationsWithAllPostQuery,
} from "@services";

export function useAllOrganizationsWithAllPost() {
  const {
    organizations = [],
    isLoadingOrganization,
    isErrorOrganization,
  } = useGetOrganizationsWithAllPostQuery(undefined, {
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
