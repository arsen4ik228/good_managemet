import { useGetPoliciesIdQuery } from "@services";

export const useGetSinglePolicy = ({ policyId = null } = {}) => {
  const {
    refetch,
    currentPolicy = {},
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,
  } = useGetPoliciesIdQuery(
    { policyId: policyId },
    {
      selectFromResult: ({
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
      }) => ({
        currentPolicy: data?.currentPolicy || {},
        isLoadingGetPoliciesId: isLoading,
        isErrorGetPoliciesId: isError,
        isFetchingGetPoliciesId: isFetching,
        refetch,
      }),
      skip: !policyId,
    }
  );

  return {
    refetch,
    
    currentPolicy,
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,
  };
};
