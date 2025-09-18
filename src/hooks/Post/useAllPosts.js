import { useGetPostsQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useAllPosts = ({organizationId = null, structure = false} = {}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    allPosts = [],
    isLoadingGetPosts,
    isFetchingGetPosts,
    isErrorGetPosts,
    refetch,
  } = useGetPostsQuery(
    { organizationId: organizationId ?? reduxSelectedOrganizationId, structure },
    {
      selectFromResult: ({ data, isLoading, isFetching,  isError, refetch }) => ({
        allPosts: data?.originalPosts || [],
        isLoadingGetPosts: isLoading,
        isFetchingGetPosts: isFetching,
        isErrorGetPosts: isError,
        refetch
      }),
    }
  );

  return {
    reduxSelectedOrganizationId,

    refetch,

    allPosts,
    isLoadingGetPosts,
    isFetchingGetPosts,
    isErrorGetPosts,
  };
};
