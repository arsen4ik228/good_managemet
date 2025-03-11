import { useGetPostsQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useAllPosts = ({organizationId = null, structure = false}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    allPosts = [],
    isLoadingGetPosts,
    isFetchingGetPosts,
    isErrorGetPosts,
  } = useGetPostsQuery(
    { organizationId: organizationId ?? reduxSelectedOrganizationId, structure },
    {
      selectFromResult: ({ data, isLoading, isFetching,  isError }) => ({
        allPosts: data || [],
        isLoadingGetPosts: isLoading,
        isFetchingGetPosts: isFetching,
        isErrorGetPosts: isError,
      }),
    }
  );

  return {
    reduxSelectedOrganizationId,

    allPosts,
    isLoadingGetPosts,
    isFetchingGetPosts,
    isErrorGetPosts,
  };
};
