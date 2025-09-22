import { useUpdatePoliciesMutation } from "@services";
import { useMutationHandler } from "@hooks";

export const useUpdatePolicy = () => {

  const [
    updatePolicy,
    {
      isLoading: isLoadingUpdatePoliciesMutation,
      isSuccess: isSuccessUpdatePoliciesMutation,
      isError: isErrorUpdatePoliciesMutation,
      error: ErrorUpdatePoliciesMutation,
      reset: resetUpdatePoliciesMutation,
    },
  ] = useUpdatePoliciesMutation();

  const localIsResponseUpdatePoliciesMutation = useMutationHandler(
    isSuccessUpdatePoliciesMutation,
    isErrorUpdatePoliciesMutation,
    resetUpdatePoliciesMutation
  );

  return {
    updatePolicy,
    isLoadingUpdatePoliciesMutation,
    isSuccessUpdatePoliciesMutation,
    isErrorUpdatePoliciesMutation,
    ErrorUpdatePoliciesMutation,
    localIsResponseUpdatePoliciesMutation,
  };
};
