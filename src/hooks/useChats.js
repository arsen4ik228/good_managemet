import {useGetAllChatsQuery} from '../store/services/chat.servise.js'
import useGetReduxOrganization from "./useGetReduxOrganization";
import { useMutationHandler } from "./useMutationHandler";

export const useChats = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();


  const { data: allChatsData, isLoading: loadingAllChats, refetch: refetchAllChats} = useGetAllChatsQuery({organizationId: reduxSelectedOrganizationId})


  return {
    reduxSelectedOrganizationId,

    allChats: allChatsData?.contacts,
    externalContacts: allChatsData?.externalContacts,
    loadingAllChats,
    refetchAllChats,
  };
};
