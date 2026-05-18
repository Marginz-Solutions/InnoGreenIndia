import React from 'react'

const ErrorBanner = ({ error, className }: { error: string; className?: string }) => {
  return (
    <div className={`w-full flex justify-start items-center rounded-xl border-2 border-red-400 px-2 py-3 bg-red-400/50 ${className}`} role="alert">
        <p className="text-sm text-red-500">{error}</p>
    </div>
  )
}

export default ErrorBanner