import {
  useDeleteControlPanelMutation,
  useGetAllControlPanelQuery,
  useGetControlPanelIdQuery,
  usePostControlPanelMutation,
  useUpdateControlPanelMutation,
} from "@BLL/controlPanel/controlPanelApi";
import useGetOrganizationId from "./useGetReduxOrganization";
import { useMutationHandler } from "./useMutationHandler";

export default function useControlPanel({ selectedControlPanelId }) {
  const { reduxSelectedOrganizationId, reduxSelectedOrganizationReportDay } = useGetOrganizationId();

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

  const {
    currentControlPanel = {},
    statisticsIdsInPanel = [],
    statisticsPoints = [],
    statisticsForDragDrop = [],
    isLoadingGetontrolPanelId,
    isFetchingGetontrolPanelId,
    isErrorGetontrolPanelId,
  } = useGetControlPanelIdQuery(
    { controlPanelId: selectedControlPanelId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentControlPanel: data?.response || {},
        statisticsIdsInPanel: data?.statisticsIdsInPanel || [],
        statisticsPoints: data?.statisticsPoints || [],
        statisticsForDragDrop: data?.statisticsForDragDrop || [],
        isLoadingGetontrolPanelId: isLoading,
        isErrorGetontrolPanelId: isError,
        isFetchingGetontrolPanelId: isFetching,
      }),
      skip: !selectedControlPanelId,
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

    // Получение панели по id
    currentControlPanel,
    statisticsIdsInPanel,
    statisticsPoints,
    statisticsForDragDrop,
    isLoadingGetontrolPanelId,
    isFetchingGetontrolPanelId,
    isErrorGetontrolPanelId,

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
