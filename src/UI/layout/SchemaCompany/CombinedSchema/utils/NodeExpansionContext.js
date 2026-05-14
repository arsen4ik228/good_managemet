import { createContext } from 'react';

export const NodeExpansionContext = createContext({
    openNodeId: null,
    setOpenNodeId: () => {},
    wrapperRef: { current: null },
});
