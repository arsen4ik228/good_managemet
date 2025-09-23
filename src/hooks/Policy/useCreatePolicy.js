import { usePostPoliciesMutation } from "@services";
import { useMutationHandler, useGetReduxOrganization } from "@hooks";

export const useCreatePolicy = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const [
    createPolicy,
    {
      isLoading: isLoadingPostPoliciesMutation,
      isSuccess: isSuccessPostPoliciesMutation,
      isError: isErrorPostPoliciesMutation,
      error: ErrorPostPoliciesMutation,
      reset: resetPostPoliciesMutation,
    },
  ] = usePostPoliciesMutation();

  const localIsResponsePostPoliciesMutation = useMutationHandler(
    isSuccessPostPoliciesMutation,
    isErrorPostPoliciesMutation,
    resetPostPoliciesMutation
  );

  return {
    reduxSelectedOrganizationId,

    createPolicy,
    isLoadingPostPoliciesMutation,
    isSuccessPostPoliciesMutation,
    isErrorPostPoliciesMutation,
    ErrorPostPoliciesMutation,
    localIsResponsePostPoliciesMutation,
  };
};
