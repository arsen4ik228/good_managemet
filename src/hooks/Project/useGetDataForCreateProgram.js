import { useGetProgramNewQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetDataForCreateProgram = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    posts = [],
    strategies = [],
    projects = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetProgramNewQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        posts: data?.posts || [],
        strategies: data?.strategies || [],
        projects: data?.projects || [],
        isLoadingGetNew: isLoading,
        isErrorGetNew: isError,
      }),
    }
  );

  return {
    reduxSelectedOrganizationId,

    posts,
    strategies,
    projects,

    isLoadingGetNew,
    isErrorGetNew,
  };
};
