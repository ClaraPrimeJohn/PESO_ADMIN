import React from 'react'
import ManageAccountsTable from '../components/TableAccounts'

const ManageAccounts = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <ManageAccountsTable />
            </div>
        </div>
    )
}

export default ManageAccounts