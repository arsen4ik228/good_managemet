import { Select } from 'antd'
import React from 'react'


export default function RoleContainer({ rolesArray, role, setRole }) {
    const employeeRole = rolesArray?.find(item => item.roleName === 'Сотрудник')
    console.log(setRole)
    return (
        <div>
            <Select
                style={{ width: '250px', textAlign: 'center' }}
                size="large"
                placeholder="Назначьте роль"
                value={role || employeeRole?.id || undefined}
                onChange={(e) => setRole(e)}
            >
                {rolesArray?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.roleName}
                    </Select.Option>
                ))}
            </Select>
        </div>
    )
}
