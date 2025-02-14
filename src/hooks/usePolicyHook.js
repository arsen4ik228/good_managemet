
import {
  useGetPoliciesIdQuery,
  useGetPoliciesQuery,
  usePostPoliciesMutation,
  useUpdatePoliciesMutation,
} from "@services";

import { useMutationHandler } from "./useMutationHandler";

export const usePolicyHook = ({
  policyId = null,
  organizationId = null,
} = {}) => {
  const {
    activeDirectives = [],
    draftDirectives = [],
    archiveDirectives = [],
    activeInstructions = [],
    draftInstructions = [],
    archiveInstructions = [],
    //Valera
    instructionsActive = [],
    instructionsDraft = [],
    instructionsCompleted = [],

    directivesActive = [],
    directivesDraft = [],
    directivesCompleted = [],

    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,
  } = useGetPoliciesQuery(
    { organizationId: organizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        activeDirectives: data?.activeDirectives || [],
        draftDirectives: data?.draftDirectives || [],
        archiveDirectives: data?.archiveDirectives || [],
        activeInstructions: data?.activeInstructions || [],
        draftInstructions: data?.draftInstructions || [],
        archiveInstructions: data?.archiveInstructions || [],
        //Валера
        instructionsActive: data?.instructionsActive || [],
        instructionsDraft: data?.instructionsDraft || [],
        instructionsCompleted: data?.instructionsCompleted || [],

        directivesActive: data?.directivesActive || [],
        directivesDraft: data?.directivesDraft || [],
        directivesCompleted: data?.directivesCompleted || [],

        isLoadingGetPolicies: isLoading,
        isErrorGetPolicies: isError,
        isFetchingGetPolicies: isFetching,
      }),
      skip: !organizationId,
    }
  );

  const {
    currentPolicy = {},
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,
  } = useGetPoliciesIdQuery(
    { policyId: policyId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentPolicy: data?.currentPolicy || {},
        isLoadingGetPoliciesId: isLoading,
        isErrorGetPoliciesId: isError,
        isFetchingGetPoliciesId: isFetching,
      }),
      skip: !policyId,


  const [
    postPolicy,
    {
      isLoading: isLoadingPostPoliciesMutation,
      isSuccess: isSuccessPostPoliciesMutation,
      isError: isErrorPostPoliciesMutation,
      error: ErrorPostPoliciesMutation,
      reset: resetPostPoliciesMutation,
    },
  ] = usePostPoliciesMutation();

  const localIsResponsePostPoliciesMutation = useMutationHandler(
    isSuccessPostPoliciesMutation,
    isErrorPostPoliciesMutation,
    resetPostPoliciesMutation
  );

  const [
    updatePolicy,
    {
      isLoading: isLoadingUpdatePoliciesMutation,
      isSuccess: isSuccessUpdatePoliciesMutation,
      isError: isErrorUpdatePoliciesMutation,
      error: ErrorUpdatePoliciesMutation,
      reset: resetUpdatePoliciesMutation,
    },
  ] = useUpdatePoliciesMutation();

  const localIsResponseUpdatePoliciesMutation = useMutationHandler(
    isSuccessUpdatePoliciesMutation,
    isErrorUpdatePoliciesMutation,
    resetUpdatePoliciesMutation
  );

  return {
    //useGetPoliciesQuery
    activeDirectives,
    draftDirectives,
    archiveDirectives,
    activeInstructions,
    draftInstructions,
    archiveInstructions,
    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,

    //Valera
    instructionsActive,
    instructionsDraft,
    instructionsCompleted,

    directivesActive,
    directivesDraft,
    directivesCompleted,

    //useGetPoliciesIdQuery
    currentPolicy,
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,

    postPolicy,
    isLoadingPostPoliciesMutation,
    isSuccessPostPoliciesMutation,
    isErrorPostPoliciesMutation,
    ErrorPostPoliciesMutation,
    localIsResponsePostPoliciesMutation,

    updatePolicy,
    isLoadingUpdatePoliciesMutation,
    isSuccessUpdatePoliciesMutation,
    isErrorUpdatePoliciesMutation,
    ErrorUpdatePoliciesMutation,
    localIsResponseUpdatePoliciesMutation,
  };
};
