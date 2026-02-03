import * as Accordion from "@radix-ui/react-accordion";
import {forwardRef} from "react";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import styles from "./AccordionRdx.module.css";

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
