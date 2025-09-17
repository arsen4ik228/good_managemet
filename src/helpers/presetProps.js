import {selectedOrganizationName} from './constants'


const props = {
    'posts': {
        name: selectedOrganizationName,
    },
    'statistics': {
        name: selectedOrganizationName,
    },
    'goal': {
        name: selectedOrganizationName,
    },
    'policies': {
        name: selectedOrganizationName,
    },
    'helper': {
        name: 'Гудменеджер',
        postsNames: 'ИИ Помощник',
    }
}


export const presetProps = (componentType) => {

    console.log(componentType)

    return props[componentType]

}