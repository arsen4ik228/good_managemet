import * as Accordion from "@radix-ui/react-accordion";
import {forwardRef} from "react";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import styles from "./AccordionRdx.module.css";
import { Skeleton } from 'antd';

export const AccordionRdx = forwardRef(
    ({accordionId, triggerContent, children, isOpen, onToggle}, ref) => (
        <div ref={ref}>
            <Accordion.Root
                type="single"
                collapsible
                value={isOpen ? accordionId : null}
                onValueChange={(val) => {
                    onToggle(val); // ← принимаем И открытие, И закрытие
                }}
                className={styles.accordionRoot}
            >
                <Accordion.Item value={accordionId} className={styles.accordionItem}>
                    <Accordion.Header>
                        <Accordion.Trigger className={styles.accordionTrigger}>
                            {triggerContent}
                            <ChevronDownIcon className={styles.chevron}/>
                        </Accordion.Trigger>
                    </Accordion.Header>

                    <Accordion.Content className={styles.accordionContent}>
                        {children}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    )
);

export const AccordionRdxSkeleton = forwardRef((_, ref) => (
    <div ref={ref}>
        <Accordion.Root
            type="single"
            value="skeleton"
            className={styles.accordionRoot}
        >
            <Accordion.Item value="skeleton" className={styles.accordionItem}>
                <Accordion.Header>
                    <Accordion.Trigger className={styles.accordionTrigger}>
                        <Skeleton active paragraph={{ rows: 1 }} title={false} />
                        <ChevronDownIcon className={styles.chevron}/>
                    </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className={styles.accordionContent}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    </div>
));