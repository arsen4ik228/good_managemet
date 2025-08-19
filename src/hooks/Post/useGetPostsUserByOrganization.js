import { useGetPostsUserByOrganizationQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetPostsUserByOrganization = () => {

  const  { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    data: userPosts = [],
    isLoading: isLoadingGetPostsUser,
    isFetching: isFetchingGetPostsUser,
    isError: isErrorGetPostsUser,
  } = useGetPostsUserByOrganizationQuery({organizationId : reduxSelectedOrganizationId});

  return {
    userPosts,
    isLoadingGetPostsUser,
    isFetchingGetPostsUser,
    isErrorGetPostsUser,
  };
};
