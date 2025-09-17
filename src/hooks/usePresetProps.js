import { useGetReduxOrganization } from "../hooks"
// import React from "react"

const props = {
    'posts': {
        name: "posts",
        postsNames: 'postssss ыыыы'
    },
}

export const presetProps = (componentType) => {
}

export const usePresetProps = (componentType) => {

    const { reduxSelectedOrganizationId } = useGetReduxOrganization()

    return props[componentType]

}