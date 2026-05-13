import React from "react";

const ProductCard = () => {
  return (
    <div className="h-full flex flex-col rounded-2xl bg-[#ffffff] p-6 shadow-md border border-gray-200">
      
    
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-[#1f3d1f]">
          Water-Soluble Fertilizers (WSF)
        </h2>

        <p className="mt-2 text-gray-600">
          Premium soluble nutrition for fertigation and foliar programs.
        </p>

        <div className="mt-4 inline-block rounded-full bg-[#76936f85] px-4 py-2 text-sm font-medium text-gray-700">
          <span className="font-semibold text-[#2d6d0d]">
            Brand focus: FINOZEN
          </span>
        </div>
      </div>

    
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button className="rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-6 py-2 text-white font-medium shadow-md hover:opacity-90 transition">
          Inquire via Smart Enquiry
        </button>

        <button className="rounded-xl border border-green-700 px-6 py-2 text-green-900 font-medium hover:bg-green-50 transition">
          Brand page
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
