import { useDeleteProjectDraftIdMutation, } from "@services/index";

export const useDeleteSingleProjectDraftId = () => {
  const [
    deleteProject,
      {
          isLoading: isLoadingDeleteProjectMutation,
          isSuccess: isSuccessDeleteProjectMutation,
          isError: isErrorDeleteProjectMutation,
          error: ErrorDeleteProjectMutation,
      }
  ] = useDeleteProjectDraftIdMutation();


  return {
      deleteProject,
      isLoadingDeleteProjectMutation,
      isSuccessDeleteProjectMutation,
      isErrorDeleteProjectMutation,
      ErrorDeleteProjectMutation
  };
};
