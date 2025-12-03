import { useUpdateStrategyMutation } from "@services/index";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateSingleStrategy = () => {
  const [
    updateStrategy,
    {
      isLoading: isLoadingUpdateStrategyMutation,
      isSuccess: isSuccessUpdateStrategyMutation,
      isError: isErrorUpdateStrategyMutation,
      error: errorUpdateStrategyMutation,
      reset: resetUpdateStrategyMutation,
    },
  ] = useUpdateStrategyMutation();

  const localIsResponseUpdateStrategyMutation = useMutationHandler(
    isSuccessUpdateStrategyMutation,
    isErrorUpdateStrategyMutation,
    resetUpdateStrategyMutation
  );

  return {
    updateStrategy,
    isLoadingUpdateStrategyMutation,
    isSuccessUpdateStrategyMutation,
    isErrorUpdateStrategyMutation,
    errorUpdateStrategyMutation,
    resetUpdateStrategyMutation,
    localIsResponseUpdateStrategyMutation,
  };
};
