import {
  useGetPostIdQuery,
} from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";


export const useGetSinglePost = ({postId, enabled = true}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();


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
    refetch,
  } = useGetPostIdQuery(
    { postId, enabled},
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
      skip: !postId || !enabled
    }
  );


  return {
    reduxSelectedOrganizationId,


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
    refetch,
  };
};
