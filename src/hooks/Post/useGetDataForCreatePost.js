
import {
  useGetPostNewQuery,
} from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";


export const useGetDataForCreatePost = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();


const {
    workers = [],
    policies = [],
    roles = [],
    parentPosts = [],
    maxDivisionNumber = undefined,
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetPostNewQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        workers: data?.workers || [],
        policies: data?.policies || [],
        parentPosts: data?.posts || [],
        roles: data?.roles || [],
        maxDivisionNumber: data?.maxDivisionNumber + 1 || undefined,
        isLoadingGetNew: isLoading,
        isErrorGetNew: isError,
        data: data,
      }),
    }
  );


  return {
    reduxSelectedOrganizationId,


    workers,
    policies,
    roles ,
    parentPosts,
    maxDivisionNumber,
    isLoadingGetNew,
    isErrorGetNew,
  };
};

