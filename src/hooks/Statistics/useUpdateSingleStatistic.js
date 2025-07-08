import { useUpdateStatisticsMutation } from "@services/index";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateSingleStatistic = () => {
  const [
    updateStatistics,
    {
      isLoading: isLoadingUpdateStatisticMutation,
      isSuccess: isSuccessUpdateStatisticMutation,
      isError: isErrorUpdateStatisticMutation,
      error: ErrorUpdateStatisticMutation,
      reset: resetUpdateStatisticsMutation,
    },
  ] = useUpdateStatisticsMutation();

  const localIsResponseUpdateStatisticsMutation = useMutationHandler(
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    resetUpdateStatisticsMutation
  );

  return {
    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,
  };
};
