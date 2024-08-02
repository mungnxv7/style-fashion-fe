const ProductListSkeleton = () => {
    return (
        <div className="relative pt-12 px-2 animate-pulse grid lg:grid-cols-8 sm:grid-cols-5 grid-cols-2 gap-2 border-t border-slate-100">
            {/* Ảnh */}
            <div className="p-4">
                <div className="px-4 py-1 w-[100px] bg-gray-200 h-[100px] rounded"></div>
            </div>
            {/* Tên sản phẩm */}
            <div className="p-2 sm:col-span-2">
                <div className="flex flex-col justify-center">
                    <div className="bg-gray-200 h-6 w-32 rounded"></div>
                </div>
            </div>
            {/* Tồn kho */}
            <div className="p-2">
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
            </div>
            {/* Lượt mua */}
            <div className="p-2">
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
            </div>
            {/* Lượt thích */}
            <div className="p-2">
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
            </div>
            {/* Đánh giá */}
            <div className="p-2">
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
            </div>
            {/* Giá thấp nhất */}
            <div className="p-2">
                <div className="bg-gray-200 h-4 w-20 rounded"></div>
            </div>
            {/* Giá cao nhất */}
            <div className="p-2">
                <div className="bg-gray-200 h-4 w-20 rounded"></div>
            </div>
        </div>
    );
}

export default ProductListSkeleton;
