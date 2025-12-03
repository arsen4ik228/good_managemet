import { usePostStrategyMutation } from "@services/index";
  import { useMutationHandler } from "@hooks/useMutationHandler";

export const useCreateStrategy = () => {
  
  const [
    postStrategy,
    {
      isLoading: isLoadingPostStrategyMutation,
      isSuccess: isSuccessPostStrategyMutation,
      isError: isErrorPostStrategyMutation,
      error: errorPostStrategyMutation,
      reset: resetPostStrategyMutation,
    },
  ] = usePostStrategyMutation();

  const localIsResponsePostStrategyMutation = useMutationHandler(
    isSuccessPostStrategyMutation,
    isErrorPostStrategyMutation,
    resetPostStrategyMutation
  );

  return {
    postStrategy,
    isLoadingPostStrategyMutation,
    isSuccessPostStrategyMutation,
    isErrorPostStrategyMutation,
    errorPostStrategyMutation,
    resetPostStrategyMutation,
    localIsResponsePostStrategyMutation,
  };
};
