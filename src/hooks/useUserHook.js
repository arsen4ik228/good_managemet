import { useGetUserNewQuery, usePostUserMutation, useGetUserIdQuery, useUpdateUserMutation } from "@services";
import { useMutationHandler } from "./useMutationHandler";
import useGetReduxOrganization from "./useGetReduxOrganization";

export function useUserHook() {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    postsWithoutUser = [],
    isLoadingGetUserNew,
    isErrorGetUserNew,
  } = useGetUserNewQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        postsWithoutUser: data?.postsWithoutUser || [],
        isLoadingGetUserNew: isLoading,
        isErrorGetUserNew: isError,
      }),
    }
  );

  const { data: userInfo = {} } = useGetUserIdQuery();


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

  const [
    updateUser
  ] = useUpdateUserMutation()

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

    postsWithoutUser,
    isLoadingGetUserNew,
    isErrorGetUserNew,

    userInfo,

    updateUser
  }
}
