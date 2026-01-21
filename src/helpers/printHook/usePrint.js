import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrint = () => {

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return {
        contentRef,
        reactToPrintFn
    }

}