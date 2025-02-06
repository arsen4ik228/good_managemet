import { usePanelToStatisticsUpdateOrderNumbersMutation } from "@services";
import { useMutationHandler } from "./useMutationHandler";

export default function usePanelToStatisticsHook() {
  const [
    updatePanelToStatisticsUpdateOrderNumbers,
    {
      isLoading: isLoadingPanelToStatisticsUpdateOrderNumbersMutation,
      isSuccess: isSuccessPanelToStatisticsUpdateOrderNumbersMutation,
      isError: isErrorPanelToStatisticsUpdateOrderNumbersMutation,
      error: ErrorPanelToStatisticsUpdateOrderNumbersMutation,
      reset: resetPanelToStatisticsUpdateOrderNumbersMutation,
    },
  ] = usePanelToStatisticsUpdateOrderNumbersMutation();

  const localIsResponsePanelToStatisticsUpdateOrderNumbersMutation = useMutationHandler(
    isSuccessPanelToStatisticsUpdateOrderNumbersMutation,
    isErrorPanelToStatisticsUpdateOrderNumbersMutation,
    resetPanelToStatisticsUpdateOrderNumbersMutation
  );

  return {
    updatePanelToStatisticsUpdateOrderNumbers,

    isLoadingPanelToStatisticsUpdateOrderNumbersMutation,
    isSuccessPanelToStatisticsUpdateOrderNumbersMutation,
    isErrorPanelToStatisticsUpdateOrderNumbersMutation,
    ErrorPanelToStatisticsUpdateOrderNumbersMutation,
    resetPanelToStatisticsUpdateOrderNumbersMutation,
    localIsResponsePanelToStatisticsUpdateOrderNumbersMutation,
  };
}


