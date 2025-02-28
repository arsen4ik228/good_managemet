import {
  useUpdatePostsMutation,
} from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";
import { useMutationHandler } from "@hooks/useMutationHandler";

export const useUpdateSinglePost = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const [
    updatePost,
    {
      isLoading: isLoadingUpdatePostMutation,
      isSuccess: isSuccessUpdatePostMutation,
      isError: isErrorUpdatePostMutation,
      error: ErrorUpdatePostMutation,
      reset:resetUpdatePostMutation,
    },
  ] = useUpdatePostsMutation();

  const localIsResponseUpdatePostMutation = useMutationHandler(
    isSuccessUpdatePostMutation,
    isErrorUpdatePostMutation,
    resetUpdatePostMutation
  );


  return {
    reduxSelectedOrganizationId,

    updatePost,
    isLoadingUpdatePostMutation,
    isSuccessUpdatePostMutation,
    isErrorUpdatePostMutation,
    ErrorUpdatePostMutation,
    localIsResponseUpdatePostMutation
  };
};
