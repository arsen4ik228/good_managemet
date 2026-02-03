import { useGetProjectQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useAllProject = () => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
      projects = [],
      archivesProjects = [],
  
      projectsWithProgram = [],
      archivesProjectsWithProgram = [],

      programs = [],
      archivesPrograms = [],

      isErrorGetProject,
      isLoadingGetProject,

      maxProjectNumber

    } = useGetProjectQuery(
      {organizationId: reduxSelectedOrganizationId},
      {
        selectFromResult: ({ data, isLoading, isError }) => ({
          projects: data?.projects || [],
          archivesProjects: data?.archivesProjects || [],
  
          projectsWithProgram: data?.projectsWithProgram || [],
          archivesProjectsWithProgram: data?.archivesProjectsWithProgram || [],
  
          programs: data?.programs || [],
          archivesPrograms: data?.archivesPrograms || [],

          maxProjectNumber: data?.maxProjectNumber || 1,

          isErrorGetProject: isError,
          isLoadingGetProject: isLoading,
        }),
        skip: !reduxSelectedOrganizationId,
      }
    );


  return {
    reduxSelectedOrganizationId,

    projects,
    archivesProjects,
    projectsWithProgram,
    archivesProjectsWithProgram,

    programs,
    archivesPrograms,

    isErrorGetProject,
    isLoadingGetProject,

    maxProjectNumber
  };
};
