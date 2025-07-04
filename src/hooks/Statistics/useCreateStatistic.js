

import { usePostStatisticsMutation } from "@services/index";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useCreateStatistic = () => {
const [
    postStatistics,
    {
      isLoading: isLoadingPostStatisticMutation,
      isSuccess: isSuccessPostStatisticMutation,
      isError: isErrorPostStatisticMutation,
      error: ErrorPostStatisticMutation,
      reset: resetPostStatisticsMutation,
    },
  ] = usePostStatisticsMutation();

  const localIsResponsePostStatisticsMutation = useMutationHandler(
    isSuccessPostStatisticMutation,
    isErrorPostStatisticMutation,
    resetPostStatisticsMutation
  );

  return {
    postStatistics,
    isLoadingPostStatisticMutation,
    isSuccessPostStatisticMutation,
    isErrorPostStatisticMutation,
    ErrorPostStatisticMutation,
    localIsResponsePostStatisticsMutation,
  };
};
