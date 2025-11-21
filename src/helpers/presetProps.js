import { selectedOrganizationName } from './constants'


const props = {
    'posts': {
        // name: selectedOrganizationName,
    },
    'statistics': {
        // name: selectedOrganizationName,
    },
    'goal': {
        // name: selectedOrganizationName,
    },
    'policies': {
        // name: selectedOrganizationName,
    },
    'users': {

    },
    'workingPlan': {

    },
}


export const presetProps = (componentType) => {

    console.log(componentType)

    return props[componentType]

}