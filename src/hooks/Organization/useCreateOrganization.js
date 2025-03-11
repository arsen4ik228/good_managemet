import { useMutationHandler } from "@hooks/useMutationHandler";
import { useCreateOrganizationMutation } from "@services";

export function useCreateOrganization() {
  const [
    createOrganization,
    {
      isLoading: isLoadingCreateOrganizationMutation,
      isSuccess: isSuccessCreateOrganizationMutation,
      isError: isErrorCreateOrganizationMutation,
      error: ErrorCreateOrganization,
      reset: resetCreateOrganizationMutation,
    },
  ] = useCreateOrganizationMutation();

  const localIsResponseCreateOrganizationMutation = useMutationHandler(
    isSuccessCreateOrganizationMutation,
    isErrorCreateOrganizationMutation,
    resetCreateOrganizationMutation
  );

  return {
    createOrganization,
    isLoadingCreateOrganizationMutation,
    isSuccessCreateOrganizationMutation,
    isErrorCreateOrganizationMutation,
    ErrorCreateOrganization,
    localIsResponseCreateOrganizationMutation,
  };
}
