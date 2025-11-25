import { Popconfirm, Badge, Select } from 'antd';
import icon_policy from '@image/icon_selectedPolicy.svg';
import { useGetAllPolicy } from '../../../../../hooks';

export default function AttachedPolicy({
    selectedPolicies,
    onChange
}) {

    const { instructionsActive, directivesActive, disposalsActive } = useGetAllPolicy();


    const popconfirmContent = (
        <Select
            style={{
                width: "400px"
            }}
            value={selectedPolicies}
            onChange={(ids) => onChange(ids)}
            // bordered={false}
            mode="multiple"
            showSearch
            placeholder="Выберите политику"
            optionFilterProp="label"
            options={[...instructionsActive, ...directivesActive, ...disposalsActive].map((p) => ({
                label: p.policyName,
                value: p.id,
            }))}
        />
    );

    console.log("selectedPolicies = ", selectedPolicies);

    return (
        <Popconfirm
            placement="topLeft"
            title={null}
            description={popconfirmContent}
            okText="Закрыть"
            cancelButtonProps={{ style: { display: "none" } }}
            icon={null}
            showCancel={false}
        >
            <Badge
                count={selectedPolicies.length}
                size="small"
                offset={[-5, 5]} // Смещение бейджа в правый верхний угол
                style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: '#005475', // Красный цвет для бейджа
                }}
            >
                <img src={icon_policy} />
            </Badge>
        </Popconfirm>
    )
}
