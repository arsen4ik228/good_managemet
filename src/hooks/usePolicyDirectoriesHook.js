import { selectedOrganizationId } from "../store/services/index";
import { useDeletePolicyDirectoriesMutation, useGetPolicyDirectoriesIdQuery, useGetPolicyDirectoriesQuery, usePostPolicyDirectoriesMutation, useUpdatePolicyDirectoriesMutation } from "../mobile/BLL/policyDirectoriesApi";


export const usePoliceDirectoriesHook = (policyDirectoryId) => {
    const {
        policyDirectories = [],
        isLoadingPolicyDirectories,
        isErrorPolicyDirectories,
    } = useGetPolicyDirectoriesQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            policyDirectories: data || [],
            isLoadingPolicyDirectories: isLoading,
            isErrorPolicyDirectories: isError,
        }),
    });

    const [
        postDirectory,
        {
            isLoading: isLoadingUpdatePoliciesMutation,
            isSuccess: isSuccessUpdatePoliciesMutation,
            isError: isErrorUpdatePoliciesMutation,
            error: ErrorUpdatePoliciesMutation,
        },
    ] = usePostPolicyDirectoriesMutation();

    const {
        activeDirectives = [],
        activeInstructions = [],
        policyDirectory = {},
        data = [],
        isLoadingGetPolicyDirectories,
        isErrorGetPolicyDirectories,
        isFetchingGetPolicyDirectories,
    } = useGetPolicyDirectoriesIdQuery({ organizationId: selectedOrganizationId, policyDirectoryId }, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            activeDirectives: data?.activeDirectives || [],
            activeInstructions: data?.activeInstructions || [],
            policyDirectory: data?.policyDirectory || [],
            data: data?.data || [],
            isLoadingGetPolicyDirectories: isLoading,
            isErrorGetPolicyDirectories: isError,
            isFetchingGetPolicyDirectories: isFetching,
        }),
        skip: !policyDirectoryId
    });

    const [
        updatePolicyDirectories,
        {
            isLoading: isLoadingUpdatePolicyDirectoriesMutation,
            isSuccess: isSuccessUpdatePolicyDirectoriesMutation,
            isError: isErrorUpdatePolicyDirectoriesMutation,
            error: ErrorUpdateDirectories,
        },
    ] = useUpdatePolicyDirectoriesMutation();

    const [
        deletePolicyDirectories,
        {
            isLoading: isLoadingDeletePolicyDirectoriesMutation,
            isSuccess: isSuccessDeletePolicyDirectoriesMutation,
            isError: isErrorDeletePolicyDirectoriesMutation,
            error: ErrorDeleteDirectories,
        },
    ] = useDeletePolicyDirectoriesMutation();

    return {
        policyDirectories,
        isLoadingPolicyDirectories,
        isErrorPolicyDirectories,


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


        updatePolicyDirectories,
        isLoadingUpdatePolicyDirectoriesMutation,
        isSuccessUpdatePolicyDirectoriesMutation,
        isErrorUpdatePolicyDirectoriesMutation,
        ErrorUpdateDirectories,


        postDirectory,
        isLoadingUpdatePoliciesMutation,
        isSuccessUpdatePoliciesMutation,
        isErrorUpdatePoliciesMutation,
        ErrorUpdatePoliciesMutation,
    }
}