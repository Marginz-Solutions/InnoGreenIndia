import React from 'react'
import AdminContactClient from './AdminContactClient';

const page = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/contact/admin`, {
    cache: "no-store",
  })

  const { data } = await response.json();
  return (
    <AdminContactClient contactData={data[0]}/>
  )
}

export default page