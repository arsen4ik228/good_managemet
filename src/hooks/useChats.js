import {useGetAllChatsQuery} from '../store/services/chat.servise.js'
import useGetReduxOrganization from "./useGetReduxOrganization";
import { useMutationHandler } from "./useMutationHandler";

export const useChats = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();


  const { data: allChats, isLoading: loadingAllChats, refetch: refetchAllChats} = useGetAllChatsQuery({organizationId: reduxSelectedOrganizationId})


  return {
    reduxSelectedOrganizationId,

    allChats,
    loadingAllChats,
    refetchAllChats,
  };
};
