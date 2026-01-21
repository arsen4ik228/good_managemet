import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import styles from "./AccordionRdx.module.css";

export const AccordionRdx = ({accordionId, triggerContent, children }) => (
	<Accordion.Root type="single" collapsible className={styles.accordionRoot}>
		<Accordion.Item value={accordionId} className={styles.accordionItem}>
			<Accordion.Header>
				<Accordion.Trigger className={styles.accordionTrigger}>
					{triggerContent}
					<ChevronDownIcon className={styles.chevron} />
				</Accordion.Trigger>
			</Accordion.Header>

			<Accordion.Content className={styles.accordionContent}>
				{children}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
);
