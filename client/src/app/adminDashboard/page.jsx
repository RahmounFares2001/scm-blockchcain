import React from 'react'

// components
import UsersOverview from '../components/dashboard/UsersOverview'
import SuppliersOverview from '../components/dashboard/SuppliersOverview'
import OrederOverview from '../components/dashboard/OrdersOverview'
import MaterialOrederOverview from '../components/dashboard/MaterialOrderOverview'

export default function page() {
  return (
    <div className='bg-gray-100 m-10 flex flex-col gap-14' >
      <UsersOverview />
      <SuppliersOverview />

      <div className='flex gap-10' >
        <OrederOverview />

        <MaterialOrederOverview />
      </div>
    </div>
  )
}
