import { useEffect, useState } from "react";
import { useGetProgramNewQuery, useGetProjectNewQuery, useGetProjectQuery, usePostProjectMutation } from "../store/services/index";
import useGetReduxOrganization from "./useGetReduxOrganization";

export const useProjectsHook = ({ IsTypeProgram }) => {

    const [localIsTypeProgram, setLocalIsTypeProgram] = useState(false)
    const {reduxSelectedOrganizationId} = useGetReduxOrganization()

    useEffect(() => {
        if (IsTypeProgram !== undefined)
            setLocalIsTypeProgram(IsTypeProgram)
    }, [IsTypeProgram])

    const {
        projects = [],
        archivesProjects = [],
        programs = [],
        archivesPrograms = [],
        projectsWithProgram = [],
        archivesProjectsWithProgram = [],
    } = useGetProjectQuery({organizationId: reduxSelectedOrganizationId}, {
        selectFromResult: ({ data }) => ({
            projects: data?.projects || [],
            archivesProjects: data?.archivesProjects || [],
            programs: data?.programs || [],
            archivesPrograms: data?.archivesPrograms || [],
            projectsWithProgram: data?.projectsWithProgram || [],
            archivesProjectsWithProgram: data?.archivesProjectsWithProgram || [],
        }),
    });


    const {
        projectData = [],
    } = useGetProjectNewQuery({organizationId: reduxSelectedOrganizationId}, {
        selectFromResult: ({ data }) => ({
            projectData: data
        }),
        skip: localIsTypeProgram
    });


    const {
        programData = [],
    } = useGetProgramNewQuery({organizationId: reduxSelectedOrganizationId}, {
        selectFromResult: ({ data }) => ({
            programData: data
        }),
        skip: !localIsTypeProgram
    });

    const [
        postProject,
        {
            isLoading: isLoadingProjectMutation,
            isSuccess: isSuccessProjectMutation,
            isError: isErrorProjectMutation,
            error: ErrorProjectMutation,
        },
    ] = usePostProjectMutation();


    return {
        projects,
        archivesProjects,
        programs,
        archivesPrograms,
        projectsWithProgram,
        archivesProjectsWithProgram,

        projectData,

        programData,

        postProject,
        isLoadingProjectMutation,
        isSuccessProjectMutation,
        isErrorProjectMutation,
        ErrorProjectMutation,


    }
}