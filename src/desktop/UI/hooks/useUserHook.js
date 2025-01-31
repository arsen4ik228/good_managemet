import { usePostUserMutation } from "../../BLL/userApi";
import { useMutationHandler } from "./useMutationHandler";
import useGetReduxOrganization  from "./useGetReduxOrganization";

export function useUserHook() {
    const {reduxSelectedOrganizationId} = useGetReduxOrganization();
  const [
    postUser,
    {
      isLoading: isLoadingUserMutation,
      isSuccess: isSuccessUserMutation,
      isError: isErrorUserMutation,
      error: ErrorUserMutation,
      reset: resetUserMutation,
    },
  ] = usePostUserMutation();

  const localIsResponseUserMutation = useMutationHandler(
    isSuccessUserMutation,
    isErrorUserMutation,
    resetUserMutation
  );

  return {
    reduxSelectedOrganizationId,
    postUser,

    isLoadingUserMutation,
    isSuccessUserMutation,
    isErrorUserMutation,
    ErrorUserMutation,
    resetUserMutation,

    localIsResponseUserMutation,
  };
}
