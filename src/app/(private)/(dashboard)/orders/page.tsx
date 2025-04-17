'use client'

import axios from 'axios'
import { useEffect } from 'react'

export default function OrdersPage() {
  // const response = await axios.get('/api/orders')

  useEffect(() => {
    axios.get('/api/orders')
  }, [])

  return (
    <div className="p-6">
      <h1>Orders</h1>
      <p>List of orders will be displayed here.</p>
    </div>
  )
}
