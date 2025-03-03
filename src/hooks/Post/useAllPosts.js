import { useGetPostsQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useAllPosts = ({structure = false}) => {
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

  return {
    reduxSelectedOrganizationId,

    allPosts,
    isLoadingGetPosts,
    isErrorGetPosts,
  };
};
