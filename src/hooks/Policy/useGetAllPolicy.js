import { useGetPoliciesQuery } from "@services";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetAllPolicy = () => {
    
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    refetch, 

    instructionsActive = [],
    instructionsDraft = [],
    instructionsCompleted = [],

    directivesActive = [],
    directivesDraft = [],
    directivesCompleted = [],

    disposalsActive = [],
    disposalsDraft = [],
    disposalsCompleted = [],

    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,
  } = useGetPoliciesQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching, refetch }) => ({

        refetch,

        instructionsActive: data?.instructionsActive || [],
        instructionsDraft: data?.instructionsDraft || [],
        instructionsCompleted: data?.instructionsCompleted || [],

        directivesActive: data?.directivesActive || [],
        directivesDraft: data?.directivesDraft || [],
        directivesCompleted: data?.directivesCompleted || [],

        disposalsActive: data?.disposalsActive || [],
        disposalsDraft: data?.disposalsDraft || [],
        disposalsCompleted: data?.disposalsCompleted || [],

        isLoadingGetPolicies: isLoading,
        isErrorGetPolicies: isError,
        isFetchingGetPolicies: isFetching,
      }),
    }
  );

  return {
    refetch,
    
    instructionsActive,
    instructionsDraft,
    instructionsCompleted,

    directivesActive,
    directivesDraft,
    directivesCompleted,

    disposalsActive,
    disposalsDraft,
    disposalsCompleted,

    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,
  };
};
