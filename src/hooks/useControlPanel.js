import {
    useDeleteControlPanelMutation,
    useGetAllControlPanelQuery,
    usePostControlPanelMutation,
    useUpdateControlPanelMutation,
  } from "@services";
  import useGetReduxOrganization from "./useGetReduxOrganization";
  import { useMutationHandler } from "./useMutationHandler";

  export default function useControlPanel() {
    const { reduxSelectedOrganizationId, reduxSelectedOrganizationReportDay } = useGetReduxOrganization();
  
    const {
      allControlPanel = [],
      isErrorGetAllControlPanel,
      isLoadingGetAllControlPanel,
      isFetchingGetAllControlPanel,
    } = useGetAllControlPanelQuery(
      { organizationId: reduxSelectedOrganizationId },
      {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
          allControlPanel: data || [],
          isErrorGetAllControlPanel: isError,
          isLoadingGetAllControlPanel: isLoading,
          isFetchingGetAllControlPanel: isFetching,
        }),
      }
    );
  
  
    const [
      postControlPanel,
      {
        isLoading: isLoadingPostControlPanelMutation,
        isSuccess: isSuccessPostControlPanelMutation,
        isError: isErrorPostControlPanelMutation,
        error: ErrorPostControlPanel,
        reset: resetPostControlPanelMutation,
      },
    ] = usePostControlPanelMutation();
  
     
    const localIsResponsePostControlPanelMutation = useMutationHandler(
      isSuccessPostControlPanelMutation,
      isErrorPostControlPanelMutation,
      resetPostControlPanelMutation
    );
  
    const [
      updateControlPanel,
      {
        isLoading: isLoadingUpdateControlPanelMutation,
        isSuccess: isSuccessUpdateControlPanelMutation,
        isError: isErrorUpdateControlPanelMutation,
        error: ErrorUpdateControlPanel,
        reset: resetUpdateControlPanelMutation,
      },
    ] = useUpdateControlPanelMutation();
  
    const localIsResponseUpdateControlPanelMutation = useMutationHandler(
      isSuccessUpdateControlPanelMutation,
      isErrorUpdateControlPanelMutation,
      resetUpdateControlPanelMutation
    );
  
    const [
      deleteControlPanel,
      {
        isLoading: isLoadingDeleteControlPanelMutation,
        isSuccess: isSuccessDeleteControlPanelMutation,
        isError: isErrorDeleteControlPanelMutation,
        error: ErrorDeleteControlPanel,
        reset: resetDeleteControlPanelMutation,
      },
    ] = useDeleteControlPanelMutation();
  
    const localIsResponseDeleteControlPanelMutation = useMutationHandler(
      isSuccessDeleteControlPanelMutation,
      isErrorDeleteControlPanelMutation,
      resetDeleteControlPanelMutation
    );
  
    return {
    reduxSelectedOrganizationId,
    reduxSelectedOrganizationReportDay,

    // Получение всех панелей по организации
    allControlPanel,
    isErrorGetAllControlPanel,
    isLoadingGetAllControlPanel,
    isFetchingGetAllControlPanel,

    // Создание панели
    postControlPanel,
    isLoadingPostControlPanelMutation,
    isSuccessPostControlPanelMutation,
    isErrorPostControlPanelMutation,
    ErrorPostControlPanel,
    localIsResponsePostControlPanelMutation,

    //  Обновление
    updateControlPanel,
    isLoadingUpdateControlPanelMutation,
    isSuccessUpdateControlPanelMutation,
    isErrorUpdateControlPanelMutation,
    ErrorUpdateControlPanel,
    localIsResponseUpdateControlPanelMutation,

    // Удаление статистики
    deleteControlPanel,
    isLoadingDeleteControlPanelMutation,
    isSuccessDeleteControlPanelMutation,
    isErrorDeleteControlPanelMutation,
    ErrorDeleteControlPanel,
    localIsResponseDeleteControlPanelMutation
    };
  }
  