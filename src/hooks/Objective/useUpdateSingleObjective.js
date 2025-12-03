import { useUpdateObjectiveMutation } from "@services/index";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateSingleObjective = () => {
  const [
    updateObjective,
    {
      isLoading: isLoadingUpdateObjectiveMutation,
      isSuccess: isSuccessUpdateObjectiveMutation,
      isError: isErrorUpdateObjectiveMutation,
      error: errorUpdateObjectiveMutation,
      reset: resetUpdateObjectiveMutation,
    },
  ] = useUpdateObjectiveMutation();

  const localIsResponseUpdateObjectiveMutation = useMutationHandler(
    isSuccessUpdateObjectiveMutation,
    isErrorUpdateObjectiveMutation,
    resetUpdateObjectiveMutation
  );

  return {
    updateObjective,
    isLoadingUpdateObjectiveMutation,
    isSuccessUpdateObjectiveMutation,
    isErrorUpdateObjectiveMutation,
    errorUpdateObjectiveMutation,
    localIsResponseUpdateObjectiveMutation,
  };
};
