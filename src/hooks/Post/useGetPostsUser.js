import { useGetPostsUserQuery } from "@services/index";

export const useGetPostsUser = () => {
  const {
    data: userPosts = [],
    isLoading: isLoadingGetPostsUser,
    isFetching: isFetchingGetPostsUser,
    isError: isErrorGetPostsUser,
  } = useGetPostsUserQuery();

  return {
    userPosts,
    isLoadingGetPostsUser,
    isFetchingGetPostsUser,
    isErrorGetPostsUser,
  };
};