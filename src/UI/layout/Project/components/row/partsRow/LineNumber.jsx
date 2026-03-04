import s from './LineNumber.module.css'

const statusTarget = (target) => {
    let color = null;
    const targetState = target?.targetState;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (targetState) {
        case "Завершена":
            color = "green";
            break;

        case "Активная":
            if (target?.deadline) {
                const deadlineDate = new Date(target.deadline);
                deadlineDate.setHours(0, 0, 0, 0); // нормализуем дату

                color = deadlineDate >= today ? null : "red";

            }
            break;
    }

    return color;
};

export default function LineNumber({orderNumber, isCreated, target}) {
    console.log("target = " , target)
     const berderColor = statusTarget(target);
    return (
        <div
            className={s.number}
            style={{
                border: "1px solid " + berderColor,
            }}
            data-created={isCreated ? 'true' : undefined}
        >
            {orderNumber}
        </div>
    )
}
