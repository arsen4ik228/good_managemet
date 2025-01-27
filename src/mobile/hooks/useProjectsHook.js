import { useEffect, useState } from "react";
import { useGetProgramNewQuery, useGetProjectNewQuery, useGetProjectQuery, usePostProjectMutation } from "../BLL/projectApi";


export const useProjectsHook = ({ IsTypeProgram }) => {

    const [localIsTypeProgram, setLocalIsTypeProgram] = useState(false)

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
    } = useGetProjectQuery(undefined, {
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
    } = useGetProjectNewQuery(undefined, {
        selectFromResult: ({ data }) => ({
            projectData: data
        }),
        skip: localIsTypeProgram
    });


    const {
        programData = [],
    } = useGetProgramNewQuery(undefined, {
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