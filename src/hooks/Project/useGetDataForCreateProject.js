import { useGetProjectNewQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetDataForCreateProject = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    posts = [],
    strategies = [],
    programs = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetProjectNewQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        posts: data?.posts || [],
        strategies: data?.strategies || [],
        programs: data?.programs || [],
        isLoadingGetNew: isLoading,
        isErrorGetNew: isError,
      }),
    }
  );

  return {
    reduxSelectedOrganizationId,

    posts,
    strategies,
    programs,

    isLoadingGetNew,
    isErrorGetNew,
  };
};
