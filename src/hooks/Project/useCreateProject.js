import { usePostProjectMutation } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useCreateProject = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

 const [
    createProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: ErrorProjectMutation,
      reset:resetPostProjectMutation,
    },
  ] = usePostProjectMutation();


  const localIsResponsePostProjectMutation = useMutationHandler(
    isLoadingProjectMutation,
    isSuccessProjectMutation,
    resetPostProjectMutation
  );

  return {
    reduxSelectedOrganizationId,
  
    createProject,
    isLoadingProjectMutation,
    isSuccessProjectMutation,
    isErrorProjectMutation,
    ErrorProjectMutation,
    localIsResponsePostProjectMutation,
  };
};
