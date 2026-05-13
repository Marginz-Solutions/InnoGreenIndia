import ProductCard from '@/components/product-card'
import React from 'react'

const page = () => {
    return (
        <div className="ms-2 me-2 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(11)].map((_, i) => (
                <ProductCard key={i} />
            ))}
        </div>
    )
}

export default page