import {
  useGetPostIdQuery,
  useGetPostNewQuery,
  useGetPostsQuery,
  usePostPostsMutation,
  useUpdatePostsMutation,
  useGetUnderPostsQuery,
  useGetPostsUserQuery
} from "../store/services/index";
import useGetReduxOrganization from "./useGetReduxOrganization";
import { useMutationHandler } from "./useMutationHandler";

export const usePostsHook = ({postId = null, structure = false} = {}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    allPosts = [],
    isLoadingGetPosts,
    isErrorGetPosts,
  } = useGetPostsQuery(
    { organizationId: reduxSelectedOrganizationId, structure },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        allPosts: data || [],
        isLoadingGetPosts: isLoading,
        isErrorGetPosts: isError,
      }),
    }
  );

  const {
    currentPost = {},
    workers = [],
    posts = [],
    parentPost = {},
    statisticsIncludedPost = [],
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
    policiesActive = [],
    //Валера
    selectedPolicyIDInPost = null,
    selectedPolicyNameInPost = null,
    refetch: refetchPostIdQuery,
  } = useGetPostIdQuery(
    { postId },
    {
      selectFromResult: ({
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
      }) => ({
        currentPost: data?.currentPost || {},
        workers: data?.workers || [],
        parentPost: data?.parentPost || {},
        posts: data?.posts || [],
        policiesActive: data?.policiesActive || [],
        statisticsIncludedPost: data?.statisticsIncludedPost || [],
        isLoadingGetPostId: isLoading,
        isErrorGetPostId: isError,
        isFetchingGetPostId: isFetching,
        selectedPolicyIDInPost: data?.selectedPolicyIDInPost || null,
        selectedPolicyNameInPost: data?.selectedPolicyNameInPost || null,
        statisticsIncludedPost: data?.statisticsIncludedPost || [],
        refetch,
      }),
      skip:  !postId 
    }
  );

  const {
    underPosts = {},
    isLoadingGetUnderPosts,
    isErrorGetUnderPosts,
    isFetchingGetUnderPosts,
  } = useGetUnderPostsQuery(
    { postId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        underPosts: data?.underPosts || [],
        isLoadingGetUnderPosts: isLoading,
        isErrorGetUnderPosts: isError,
        isFetchingGetUnderPosts: isFetching,
      }),
      skip:  !postId
    }
  );

  const {
    staff = [],
    policies = [],
    parentPosts = [],
    maxDivisionNumber = undefined,
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetPostNewQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        staff: data?.workers || [],
        policies: data?.policies || [],
        parentPosts: data?.posts || [],
        maxDivisionNumber: data?.maxDivisionNumber + 1 || undefined,
        isLoadingGetNew: isLoading,
        isErrorGetNew: isError,
        data: data,
      }),
    }
  );

  const { data: userPosts } = useGetPostsUserQuery()

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

  const [
    postPosts,
    {
      isLoading: isLoadingPostMutation,
      isSuccess: isSuccessPostMutation,
      isError: isErrorPostMutation,
      error: ErrorPostMutation,
      reset:resetPostPostMutation,
    },
  ] = usePostPostsMutation();

  const localIsResponsePostPostMutation = useMutationHandler(
    isLoadingPostMutation,
    isSuccessPostMutation,
    resetPostPostMutation
  );

  return {
    reduxSelectedOrganizationId,

    allPosts,
    isLoadingGetPosts,
    isErrorGetPosts,

    currentPost,
    workers,
    posts,
    parentPost,
    policiesActive,
    statisticsIncludedPost,
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
    selectedPolicyIDInPost,
    selectedPolicyNameInPost,
    refetchPostIdQuery,

    underPosts,
    isLoadingGetUnderPosts,
    isErrorGetUnderPosts,
    isFetchingGetUnderPosts,

    staff,
    policies,
    parentPosts,
    maxDivisionNumber,
    isLoadingGetNew,
    isErrorGetNew,

    userPosts,

    postPosts,
    isLoadingPostMutation,
    isSuccessPostMutation,
    isErrorPostMutation,
    ErrorPostMutation,
    localIsResponsePostPostMutation,

    updatePost,
    isLoadingUpdatePostMutation,
    isSuccessUpdatePostMutation,
    isErrorUpdatePostMutation,
    ErrorUpdatePostMutation,
    localIsResponseUpdatePostMutation
  };
};
