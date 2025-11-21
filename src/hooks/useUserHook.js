import { useGetUserNewQuery, useGetActiveUsersQuery, useGetFiredUsersQuery,usePostUserMutation, useGetUserIdQuery, useUpdateUserMutation, useGetUsersQuery } from "@services";
import { useMutationHandler } from "./useMutationHandler";
import useGetReduxOrganization from "./useGetReduxOrganization";
import useGetUserId from "./useGetUserId";

export function useUserHook({userId = null} = {}) {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();
  const { reduxUserId } = useGetUserId()
  //(reduxSelectedOrganizationId, reduxUserId)
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

  const { data: userInfo, refetch: refetchUserInfo } = useGetUserIdQuery(userId ? userId : reduxUserId);


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
    updateUser,
    {
      isLoading: isLoadingUpdateUserMutation,
      isSuccess: isSuccessUpdateUserMutation,
      isError: isErrorUpdateUserMutation,
      error: ErrorUpdateUserMutation,
      reset: resetUpdateUserMutation,
    }
  ] = useUpdateUserMutation()

  const localIsResponseUserMutation = useMutationHandler(
    isSuccessUserMutation,
    isErrorUserMutation,
    resetUserMutation
  );

  const localIsResponseUpdateUserMutation = useMutationHandler(
    isSuccessUpdateUserMutation,
    isErrorUpdateUserMutation,
    resetUpdateUserMutation
  );

  const {
    allUsers = [],
  } = useGetUsersQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        allUsers: data || [],
        // isLoadingGetUserNew: isLoading,
        // isErrorGetUserNew: isError,
      }),
    }
  );

  const {
    activeUsers = [],
  } = useGetActiveUsersQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        activeUsers: data || [],
        // isLoadingGetUserNew: isLoading,
        // isErrorGetUserNew: isError,
      }),
    }
  );

  const {
    firedUsers = [],
  } = useGetFiredUsersQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        firedUsers: data || [],
        // isLoadingGetUserNew: isLoading,
        // isErrorGetUserNew: isError,
      }),
    }
  );
  

  return {
    allUsers,

    activeUsers,

    firedUsers,

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
    refetchUserInfo,

    updateUser,
    isLoadingUpdateUserMutation,
    isSuccessUpdateUserMutation,
    isErrorUpdateUserMutation,
    ErrorUpdateUserMutation,

    localIsResponseUpdateUserMutation
  }
}
