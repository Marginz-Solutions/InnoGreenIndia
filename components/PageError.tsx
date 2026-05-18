'use client';

import { AlertTriangle, ChevronLeft, RefreshCw } from 'lucide-react'
import { ErrorProps } from '@/lib/global.types'

interface DetailedErrorType extends ErrorProps {
    heading: string;
    description: string;
}

const PageError = ({ 
    error, 
    reset,
    heading,
    description
}: DetailedErrorType) => {
    return (
        <div className="p-6">
            <div className="max-w-[500px]">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-red-400 via-orange-400 to-amber-300" />
                    <div className="p-7">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-50 shrink-0 mt-0.5">
                                <AlertTriangle size={18} className="text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-semibold text-gray-900 mb-1">
                                    {heading}
                                </h2>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {(error?.message || error?.digest) && (
                            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-6 font-mono text-xs text-gray-500 space-y-1">
                                {error.message && (
                                    <p className="truncate">
                                        <span className="text-gray-400">message: </span>
                                        {error.message}
                                    </p>
                                )}
                                {error.digest && (
                                    <p>
                                        <span className="text-gray-400">digest: </span>
                                        {error.digest}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2.5 flex-wrap">
                            <button
                                onClick={reset}
                                className="inline-flex items-center gap-2 rounded-full bg-[#2d5a27] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#234820] transition cursor-pointer border-none"
                            >
                                <RefreshCw size={14} />
                                Try again
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                                Go back
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-xs text-gray-400 px-1">
                    If this keeps happening, check the server logs or contact your
                    system administrator.
                </p>
            </div>
        </div>
    )
}

export default PageError