import {
  useUpdateOrganizationsMutation
} from "@services";
import { useMutationHandler } from "@hooks/useMutationHandler";

export function useUpdateSingleOrganization() {

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
    updateOrganization,
    isLoadingUpdateOrganizationMutation,
    isSuccessUpdateOrganizationMutation,
    isErrorUpdateOrganizationMutation,
    ErrorOrganization,
    localIsResponseUpdateOrganizationMutation
  };
}
