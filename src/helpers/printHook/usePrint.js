import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrint = () => {
    const contentRef = useRef(null);

    const reactToPrintFn = useReactToPrint({
        contentRef,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
            @media print {
                html, body {
                    height: auto !important;
                    overflow: visible !important;
                }
                * {
                    overflow: visible !important;
                    max-height: none !important;
                }
            }
        `,
        onBeforePrint: () => {
            return new Promise((resolve) => {
                let el = contentRef.current?.parentElement;
                while (el) {
                    el.dataset.prevOverflow = el.style.overflow;
                    el.dataset.prevOverflowY = el.style.overflowY;
                    el.dataset.prevHeight = el.style.height;
                    el.dataset.prevMaxHeight = el.style.maxHeight;

                    el.style.overflow = 'visible';
                    el.style.overflowY = 'visible';
                    el.style.height = 'auto';
                    el.style.maxHeight = 'none';

                    el = el.parentElement;
                }
                resolve();
            });
        },
        onAfterPrint: () => {
            let el = contentRef.current?.parentElement;
            while (el) {
                el.style.overflow = el.dataset.prevOverflow || '';
                el.style.overflowY = el.dataset.prevOverflowY || '';
                el.style.height = el.dataset.prevHeight || '';
                el.style.maxHeight = el.dataset.prevMaxHeight || '';

                delete el.dataset.prevOverflow;
                delete el.dataset.prevOverflowY;
                delete el.dataset.prevHeight;
                delete el.dataset.prevMaxHeight;

                el = el.parentElement;
            }
        },
    });

    return {
        contentRef,
        reactToPrintFn,
    };
};