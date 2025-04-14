import { useGetProgramIdQuery } from "@services/index";
import useGetReduxOrganization from "@hooks/useGetReduxOrganization";

export const useGetSingleProgram = ({ selectedProgramId }) => {
  const { reduxSelectedOrganizationId } = useGetReduxOrganization();

  const {
    currentProgram = {},
    currentProjects = [],
    targets = [],

    isLoadingGetProgramId,
    isErrorGetProgramId,
    isFetchingGetProgramId,
  } = useGetProgramIdQuery(
    { programId: selectedProgramId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentProgram: data?.currentProgram || {},
        currentProjects: data?.currentProjects || [],
        targets: data?.targets || [],
        isLoadingGetProgramId: isLoading,
        isErrorGetProgramId: isError,
        isFetchingGetProgramId: isFetching,
      }),
      skip: !selectedProgramId,
    }
  );

  return {
    reduxSelectedOrganizationId,

    currentProgram,
    currentProjects,
    targets,

    isLoadingGetProgramId,
    isErrorGetProgramId,
    isFetchingGetProgramId,
  };
};
