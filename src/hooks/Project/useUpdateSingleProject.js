import { useUpdateProjectMutation } from "@services/index";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateSingleProject = () => {
  const [
    updateProject,
    {
      isLoading: isLoadingUpdateProjectMutation,
      isSuccess: isSuccessUpdateProjectMutation,
      isError: isErrorUpdateProjectMutation,
      error: ErrorUpdateProjectMutation,
      reset: resetUpdateProjectMutation,
    },
  ] = useUpdateProjectMutation();

  const localIsResponseUpdateProjectMutation = useMutationHandler(
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    resetUpdateProjectMutation
  );

  return {
    updateProject,
    isLoadingUpdateProjectMutation,
    isSuccessUpdateProjectMutation,
    isErrorUpdateProjectMutation,
    ErrorUpdateProjectMutation,
    localIsResponseUpdateProjectMutation,
  };
};
