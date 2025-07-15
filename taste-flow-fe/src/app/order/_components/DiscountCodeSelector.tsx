'use client';

import { useState } from 'react';
import { Tag, ChevronDown, Percent, Calendar } from 'lucide-react';
import { Discount } from '@/utils/type';
import { useDiscountCode } from '@/hook/useOrder';

interface DiscountCodeSelectorProps {
  selectedDiscountCode: string | null;
  discountCodeList: Discount[];
  onDiscountCodeChange: (discountCode: string | null) => void;
}

export const DiscountCodeSelector: React.FC<DiscountCodeSelectorProps> = ({
  selectedDiscountCode,
  onDiscountCodeChange,
  discountCodeList
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const activeDiscountCodes = discountCodeList?.filter(
    (discount: Discount) => discount.active
  ) || [];

  const selectedDiscount = activeDiscountCodes?.find(
    (discount: Discount) => discount.discountCode === selectedDiscountCode
  );

  // if (isLoading) {
  //   return (
  //     <div className="mb-6">
  //       <div className="flex items-center gap-2 mb-3">
  //         <Tag className="w-5 h-5 text-[#F26D16]" />
  //         <h3 className="text-lg font-semibold text-white">Mã giảm giá</h3>
  //       </div>
  //       <div className="animate-pulse">
  //         <div className="h-12 bg-gray-700 rounded-lg"></div>
  //       </div>
  //     </div>
  //   );
  // }

  if (activeDiscountCodes.length === 0) return null;

  const handleSelect = (code: string | null) => {
    onDiscountCodeChange(code);
    setIsExpanded(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-5 h-5 text-[#F26D16]" />
        <h3 className="text-lg font-semibold text-white">Mã giảm giá</h3>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-[#F26D16] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            {selectedDiscount ? (
              <div>
                <span className="text-white font-medium">{selectedDiscount.name}</span>
                <span className="text-[#F26D16] ml-2">-{selectedDiscount.discount}%</span>
              </div>
            ) : (
              <span className="text-gray-400">Chọn mã giảm giá</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {/* Không dùng mã */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`w-full px-4 py-3 text-left hover:bg-[#3A3A3A] border-b border-[#3A3A3A] transition-colors ${
                selectedDiscountCode === null ? 'bg-[#F26D16]/10' : ''
              }`}
            >
              <span className="text-gray-300">Không sử dụng mã giảm giá</span>
            </button>

            {/* Các mã giảm giá */}
            {activeDiscountCodes.map((discount: Discount) => (
              <button
                key={discount.id}
                type="button"
                onClick={() => handleSelect(discount.discountCode)}
                className={`w-full px-4 py-3 text-left hover:bg-[#3A3A3A] border-b border-[#3A3A3A] last:border-b-0 transition-colors ${
                  selectedDiscountCode === discount.discountCode ? 'bg-[#F26D16]/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[#F26D16]" />
                      <span className="font-medium text-white">{discount.name}</span>
                      <span className="text-[#F26D16] text-sm">-{discount.discount}%</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{discount.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>đến {formatDate(discount.endTime)}</span>
                      </div>
                    </div>
                  </div>
                  {selectedDiscountCode === discount.discountCode && (
                    <div className="w-5 h-5 rounded-full bg-[#F26D16] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
