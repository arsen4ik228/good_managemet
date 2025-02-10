import {
    useGetObjectiveIdQuery,
    useUpdateObjectiveMutation,
  } from "@services";
  import { useMutationHandler } from "./useMutationHandler";
  
  export const useObjectiveHook = (strategyId) => {
  
    const {
      currentObjective,
      isLoadingGetObjectiveId,
      isErrorGetObjectiveId,
      isFetchingGetObjectiveId,
    } = useGetObjectiveIdQuery(
      { strategyId },
      {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
          currentObjective: data?.currentObjective || {},
          isLoadingGetObjectiveId: isLoading,
          isErrorGetObjectiveId: isError,
          isFetchingGetObjectiveId: isFetching,
        }),
        skip: !strategyId,
      }
    );
  
    const [
      updateObjective,
      {
        isLoading: isLoadingUpdateObjectiveMutation,
        isSuccess: isSuccessUpdateObjectiveMutation,
        isError: isErrorUpdateObjectiveMutation,
        error: errorUpdateObjectiveMutation,
        reset: resetUpdateObjectiveMutation,
      },
    ] = useUpdateObjectiveMutation();
  
    const localIsResponseUpdateObjectiveMutation = useMutationHandler(
      isSuccessUpdateObjectiveMutation,
      isErrorUpdateObjectiveMutation,
      resetUpdateObjectiveMutation
    );
  
    return {
      currentObjective,
      isLoadingGetObjectiveId,
      isErrorGetObjectiveId,
      isFetchingGetObjectiveId,
  
      updateObjective,
      isLoadingUpdateObjectiveMutation,
      isSuccessUpdateObjectiveMutation,
      isErrorUpdateObjectiveMutation,
      errorUpdateObjectiveMutation,
      localIsResponseUpdateObjectiveMutation,
    };
  };