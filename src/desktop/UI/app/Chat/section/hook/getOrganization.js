

import { useGetOrganizationsQuery } from "@BLL/organizationApi";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export function useOrganization() {

  const { reduxSelectedOrganizationId } = useGetReduxOrganization();
  
  const {
    organizations = [],
    isLoadingOrganization,
    isErrorOrganization,
  } = useGetOrganizationsQuery({organizationId:reduxSelectedOrganizationId}, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      organizations: data?.organizations || [],
      isLoadingOrganization: isLoading,
      isErrorOrganization: isError,
    }),
  });

  return {
    organizations,
    isLoadingOrganization,
    isErrorOrganization
  };
}
