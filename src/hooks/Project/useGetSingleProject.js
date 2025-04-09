import { useGetProjectIdQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetSingleProject = ({selectedProjectId}) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

   const {
     currentProject = {},
     targets = [],
     isLoadingGetProjectId,
     isErrorGetProjectId,
     isFetchingGetProjectId,
   } = useGetProjectIdQuery(
     { projectId: selectedProjectId },
     {
       selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
         currentProject: data?.currentProject || {},
         targets: data?.targets || [],
         isLoadingGetProjectId: isLoading,
         isErrorGetProjectId: isError,
         isFetchingGetProjectId: isFetching,
       }),
       skip: !selectedProjectId, 
     }
   );

  return {
    reduxSelectedOrganizationId,

    currentProject,
    targets,
    isLoadingGetProjectId,
    isErrorGetProjectId,
    isFetchingGetProjectId,
  };
};
