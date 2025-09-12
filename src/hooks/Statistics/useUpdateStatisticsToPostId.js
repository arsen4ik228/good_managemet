import { useUpdateStatisticsToPostIdMutation } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateStatisticsToPostId = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const [
    updateStatisticsToPostId,
    {
      isLoading: isLoadingStatisticsToPostIdMutation,
      isSuccess: isSuccessUpdateStatisticsToPostIdMutation,
      isError: isErrorUpdateStatisticsToPostIdMutation,
      error: ErrorUpdateStatisticsToPostIdMutation,
      reset: resetUpdateStatisticsToPostIdMutation,
    },
  ] = useUpdateStatisticsToPostIdMutation();

  const localIsResponseUpdateStatisticsToPostIdMutation = useMutationHandler(
    isSuccessUpdateStatisticsToPostIdMutation,
    isErrorUpdateStatisticsToPostIdMutation,
    resetUpdateStatisticsToPostIdMutation
  );

  return {
    reduxSelectedOrganizationId,

    updateStatisticsToPostId,
    isLoadingStatisticsToPostIdMutation,
    isSuccessUpdateStatisticsToPostIdMutation,
    isErrorUpdateStatisticsToPostIdMutation,
    ErrorUpdateStatisticsToPostIdMutation,
    localIsResponseUpdateStatisticsToPostIdMutation,
  };
};
