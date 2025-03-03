import { useGetPostNewQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetDataCreatePost = ({ enabled = true }) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    staff = [],
    policies = [],
    parentPosts = [],
    maxDivisionNumber = undefined,
    isLoadingGetNew,
    isFetchingGetNew,
    isErrorGetNew,
  } = useGetPostNewQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        staff: data?.workers || [],
        policies: data?.policies || [],
        parentPosts: data?.posts || [],
        maxDivisionNumber: data?.maxDivisionNumber + 1 || undefined,
        isLoadingGetNew: isLoading,
        isFetchingGetNew: isFetching,
        isErrorGetNew: isError,
        data: data,
      }),
      skip: !enabled,
    }
  );

  return {
    reduxSelectedOrganizationId,

    maxDivisionNumber,
    parentPosts,
    staff,
    policies,
    isLoadingGetNew,
    isFetchingGetNew,
    isErrorGetNew,
  };
};
