import {
  useGetOrganizationsQuery,
} from "@services";

export function useAllOrganizations() {

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
