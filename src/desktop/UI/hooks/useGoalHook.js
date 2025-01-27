import {
  useGetGoalQuery,
  usePostGoalMutation,
  useUpdateGoalMutation,
} from "@BLL/goalApi";
import useGetReduxOrganization from "./useGetReduxOrganization";
import { useMutationHandler } from "./useMutationHandler";

export default function useGoalHook() {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    currentGoal = {},
    isErrorGetGoal,
    isLoadingGetGoal,
    isFetchingGetGoal,
  } = useGetGoalQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentGoal: data?.currentGoal || {},
        isErrorGetGoal: isError,
        isLoadingGetGoal: isLoading,
        isFetchingGetGoal: isFetching,
      }),
    }
  );

  const [
    updateGoal,
    {
      isLoading: isLoadingUpdateGoalMutation,
      isSuccess: isSuccessUpdateGoalMutation,
      isError: isErrorUpdateGoalMutation,
      error: ErrorUpdateGoalMutation,
      reset: resetUpdateGoalMutation
    },
  ] = useUpdateGoalMutation();


  const localIsResponseUpdateGoalMutation = useMutationHandler(
    isSuccessUpdateGoalMutation,
    isErrorUpdateGoalMutation,
    resetUpdateGoalMutation
  );


  const [
    postGoal,
    {
      isLoading: isLoadingPostGoalMutation,
      isSuccess: isSuccessPostGoalMutation,
      isError: isErrorPostGoalMutation,
      error: ErrorPostGoalMutation,
      reset: resetPostGoalMutation
    },
  ] = usePostGoalMutation();


   const localIsResponsePostGoalMutation = useMutationHandler(
    isSuccessPostGoalMutation,
    isErrorPostGoalMutation,
    resetPostGoalMutation
    );
  

  return {
    reduxSelectedOrganizationId,

    currentGoal,
    isErrorGetGoal,
    isLoadingGetGoal,
    isFetchingGetGoal,

    updateGoal,
    isLoadingUpdateGoalMutation,
    isSuccessUpdateGoalMutation,
    isErrorUpdateGoalMutation,
    ErrorUpdateGoalMutation,
    localIsResponseUpdateGoalMutation,

    postGoal,
    isLoadingPostGoalMutation,
    isSuccessPostGoalMutation,
    isErrorPostGoalMutation,
    ErrorPostGoalMutation,
    localIsResponsePostGoalMutation
  };
}
