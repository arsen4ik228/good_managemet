import {
  useDeletePolicyDirectoriesMutation,
  useGetPolicyDirectoriesIdQuery,
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation,
} from "@services";
import { useGetReduxOrganization } from "@hooks";
import { useMutationHandler } from "./useMutationHandler";

export const usePolicyDirectoriesHook = (policyDirectoryId) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    policyDirectories = [],
    isLoadingPolicyDirectories,
    isErrorPolicyDirectories,
    //Valera
    folders = [],
    foldersSort = [],
  } = useGetPolicyDirectoriesQuery(
    { organizationId: reduxSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        policyDirectories: data || [],
        isLoadingPolicyDirectories: isLoading,
        isErrorPolicyDirectories: isError,
        //Valera
        folders: data?.folders || [],
        foldersSort: data?.foldersSort || [],
      }),
    }
  );

  const {
    activeDirectives = [],
    activeInstructions = [],
    policyDirectory = {},
    data = [],
    isLoadingGetPolicyDirectories,
    isErrorGetPolicyDirectories,
    isFetchingGetPolicyDirectories,
  } = useGetPolicyDirectoriesIdQuery(
    { organizationId: reduxSelectedOrganizationId, policyDirectoryId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        activeDirectives: data?.activeDirectives || [],
        activeInstructions: data?.activeInstructions || [],
        policyDirectory: data?.policyDirectory || [],
        data: data?.data || [],
        isLoadingGetPolicyDirectories: isLoading,
        isErrorGetPolicyDirectories: isError,
        isFetchingGetPolicyDirectories: isFetching,
      }),
      skip: !policyDirectoryId,
    }
  );

  const [
    postDirectory,
    {
      isLoading: isLoadingPostPoliciesDirectoriesMutation,
      isSuccess: isSuccessPostPoliciesDirectoriesMutation,
      isError: isErrorPostPoliciesDirectoriesMutation,
      error: ErrorPostPoliciesDirectoriesMutation,
      reset: resetPostPolicyDirectoriesMutation,
    },
  ] = usePostPolicyDirectoriesMutation();

  const localIsResponsePostPolicyDirectoriesMutation = useMutationHandler(
    isSuccessPostPoliciesDirectoriesMutation,
    isErrorPostPoliciesDirectoriesMutation,
    resetPostPolicyDirectoriesMutation
  );

  const [
    updatePolicyDirectories,
    {
      isLoading: isLoadingUpdatePolicyDirectoriesMutation,
      isSuccess: isSuccessUpdatePolicyDirectoriesMutation,
      isError: isErrorUpdatePolicyDirectoriesMutation,
      error: ErrorUpdateDirectories,
      reset: resetUpdatePolicyDirectoriesMutation,
    },
  ] = useUpdatePolicyDirectoriesMutation();

  const localIsResponseUpdatePolicyDirectoriesMutation = useMutationHandler(
    isSuccessUpdatePolicyDirectoriesMutation,
    isErrorUpdatePolicyDirectoriesMutation,
    resetUpdatePolicyDirectoriesMutation
  );

  const [
    deletePolicyDirectories,
    {
      isLoading: isLoadingDeletePolicyDirectoriesMutation,
      isSuccess: isSuccessDeletePolicyDirectoriesMutation,
      isError: isErrorDeletePolicyDirectoriesMutation,
      error: ErrorDeleteDirectories,
      reset: resetDeletePolicyDirectoriesMutation,
    },
  ] = useDeletePolicyDirectoriesMutation();

  const localIsResponseDeletePolicyDirectoriesMutation = useMutationHandler(
    isSuccessDeletePolicyDirectoriesMutation,
    isErrorDeletePolicyDirectoriesMutation,
    resetDeletePolicyDirectoriesMutation
  );
  
  return {
    policyDirectories,
    isLoadingPolicyDirectories,
    isErrorPolicyDirectories,
    //Valera
    folders,
    foldersSort,

    activeDirectives,
    activeInstructions,
    policyDirectory,
    data,
    isLoadingGetPolicyDirectories,
    isErrorGetPolicyDirectories,
    isFetchingGetPolicyDirectories,

    deletePolicyDirectories,
    isLoadingDeletePolicyDirectoriesMutation,
    isSuccessDeletePolicyDirectoriesMutation,
    isErrorDeletePolicyDirectoriesMutation,
    ErrorDeleteDirectories,
    localIsResponseDeletePolicyDirectoriesMutation,

    updatePolicyDirectories,
    isLoadingUpdatePolicyDirectoriesMutation,
    isSuccessUpdatePolicyDirectoriesMutation,
    isErrorUpdatePolicyDirectoriesMutation,
    ErrorUpdateDirectories,
    localIsResponseUpdatePolicyDirectoriesMutation,

    postDirectory,
    isLoadingPostPoliciesDirectoriesMutation,
    isSuccessPostPoliciesDirectoriesMutation,
    isErrorPostPoliciesDirectoriesMutation,
    ErrorPostPoliciesDirectoriesMutation,
    localIsResponsePostPolicyDirectoriesMutation,
  };
};
