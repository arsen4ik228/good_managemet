
import bigProject from "../../img/bigProject.svg"
import styles from "./TriggerContent.module.css";

export const TriggerContent = ({title}) => {
  return (
   <div className={styles.triggerLeft}>
				<img src={bigProject} alt={bigProject} />
				<span>{title}</span>
			</div>
  )
}
