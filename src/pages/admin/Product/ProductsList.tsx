import { useEffect, useState } from "react";
import {
  hiddenSpinner,
  showSpinner,
} from "../../../util/util";
import { Link } from "react-router-dom";
import { Button, Image, Modal, Table, message } from "antd";
import { https } from "../../../config/axios";
import { IProduct } from "../../../types/productType";
import PaginationPage from "../../../components/PaginationPage/PaginationPage";
import productService from "../../../services/productService";
import ProductListSkeleton from "../../../components/Skeleton/Admin/ProductListSkeleton";

const ProductsList: React.FC = () => {
  const params = new URLSearchParams(location.search);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const limitPerPage = 15;
  const currentPage = params.get("page") ? Number(params.get("page")) : 1;
  const [productList, setProductList] = useState<IProduct[]>([]);

  const fetchData = async () => {
    showSpinner();
    try {
      const { data } = await productService.getAllProducts(limitPerPage, currentPage);
      setLoading(false);
      setProductList(data.results);
      setTotalProducts(data.totalResults);
      window.scrollTo(0, 0);
      hiddenSpinner();
    } catch (error) {
      hiddenSpinner();
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [location.search]);

  const handleDelete = async (id: string) => {
    showSpinner();
    try {
      const data = await https.delete(`/products/${id}`);
      if (data) {
        message.success(data.data.message);
        fetchData();
        hiddenSpinner();
      }
    } catch (error) {
      hiddenSpinner();
      console.log(error);
      message.error(error.response.data.message);
    }
  };

  const { confirm } = Modal;

  const showConfirm = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
      maskClosable: true,
    });
  };

  // Define columns for the Table
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: IProduct, index: number) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text: string) => <Image src={text} width={100} height={100} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
      sorter: (a: IProduct, b: IProduct) => a.countInStock - b.countInStock,
    },
    {
      title: "Lượt mua",
      dataIndex: "purchases",
      key: "purchases",
      sorter: (a: IProduct, b: IProduct) => a.purchases - b.purchases,
    },
    {
      title: "Lượt thích",
      dataIndex: "likes",
      key: "likes",
      sorter: (a: IProduct, b: IProduct) => a.likes - b.likes,
    },
    {
      title: "Đánh giá",
      dataIndex: "finalScoreReview",
      key: "finalScoreReview",
      sorter: (a: IProduct, b: IProduct) => a.finalScoreReview - b.finalScoreReview,
    },
    {
      title: "Giá thấp nhất",
      dataIndex: "minPrice",
      key: "minPrice",
      sorter: (a: IProduct, b: IProduct) => a.minPrice - b.minPrice,
    },
    {
      title: "Giá cao nhất",
      dataIndex: "maxPrice",
      key: "maxPrice",
      sorter: (a: IProduct, b: IProduct) => a.maxPrice - b.maxPrice,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (text: any, record: IProduct) => (
        <>
          <Link
            to={`/admin/products/${record.id}`}
            className="text-sm font-semibold text-yellow-500 hover:text-yellow-600"
          >
            Chi tiết
          </Link>
          <Button
            type="link"
            onClick={() => showConfirm(record.id)}
            className="text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Xoá
          </Button>
        </>
      ),
    },
  ];




  return (
    // <div className="">
    //   <div className="p-4 pb-0 mb-0 bg-white rounded-t-2xl">
    //     <Link
    //       to="/admin/products/add"
    //       className="text-white text-base font-semibold bg-green-500 py-2 px-2 rounded my-5 hover:bg-green-600"
    //     >
    //       <span>Thêm mới</span>
    //     </Link>
    //   </div>
    //   <div className="h-full mt-4 overflow-x-auto">
    //     <div className="w-full border-gray-200 text-slate-500">
    //       <div className="w-full grid lg:grid-cols-8 sm:grid-cols-5 grid-cols-2 gap-2 mb-2">
    //         <div className="lg:block hidden text-center pr-6 pl-4 py-3 font-bold uppercase text-slate-800">
    //           Ảnh
    //         </div>
    //         <div className="lg:block hidden sm:col-span-2 pr-6 pl-4 py-3  text-left font-bold uppercase text-slate-800">
    //           Tên sản phẩm
    //         </div>
    //         <div className="lg:block hidden col-span-3 pr-6 pl-2 py-3  text-left font-bold uppercase text-slate-800">
    //           Mô tả
    //         </div>
    //         <div className="lg:block hidden pr-6 pl-2 py-3  text-left font-bold uppercase text-slate-800">
    //           Đánh giá
    //         </div>
    //         <div className="lg:block hidden pr-6 pl-2 py-3  text-left font-bold uppercase text-slate-800">
    //           Thao tác
    //         </div>
    //       </div>
    //       <div>
    //         {
    //           loading && <div>
    //             {Array.from({ length: 10 }).map((_, index) => (
    //               <ProductListSkeleton key={index} />
    //             ))}
    //           </div>
    //         }
    //         {[...productList].map((product, index) => {
    //           return (
    //             <div
    //               key={index}
    //               className="relative grid lg:grid-cols-8 sm:grid-cols-5 grid-cols-2 gap-2 border-b border-slate-100"
    //             >
    //               {/* <span className='absolute top-0.5 left-1 text-slate-300'>{++index}</span> */}
    //               <div className="p-2">
    //                 <div className="px-2 py-1 min-w-[110px] text-center">
    //                   <Image
    //                     src={product.thumbnail}
    //                     width={100}
    //                     height={100}
    //                   />
    //                 </div>
    //               </div>
    //               <div className="p-2 sm:col-span-2">
    //                 <div className="flex flex-col justify-center">
    //                   <h6 className="text-base font-normal">{product.name}</h6>
    //                 </div>
    //               </div>
    //               <div className="lg:block p-2 col-span-3">
    //                 <p className="text-sm ">
    //                   {product.description?.slice(0, 150)}...
    //                 </p>
    //               </div>
    //               <div className="p-2 space-x-2">
    //                 <Link
    //                   to={`/admin/reviews/${product.id}`}
    //                   className="text-sm font-semibold text-green-500 hover:text-green-600"
    //                 >
    //                   Xem đánh giá
    //                 </Link>
    //               </div>
    //               <div className="p-2 space-x-2">
    //                 <Link
    //                   to={`/admin/products/${product.id}`}
    //                   className="text-sm font-semibold text-yellow-500 hover:text-yellow-600"
    //                 >
    //                   Chi tiết
    //                 </Link>
    //                 <>
    //                   <button
    //                     onClick={() => showConfirm(product.id)}
    //                     className="text-sm font-semibold text-red-500 hover:text-red-600"
    //                   >
    //                     Xoá
    //                   </button>
    //                 </>
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //     <PaginationPage
    //       current={1}
    //       total={totalProducts}
    //       pageSize={limitPerPage} />
    //   </div>

    // </div>
    <div className="">
      <div className="p-4 pb-0 mb-0 bg-white rounded-t-2xl">
        <Link
          to="/admin/products/add"
          className="text-white text-base font-semibold bg-green-500 py-2 px-2 rounded my-5 hover:bg-green-600"
        >
          <span>Thêm mới</span>
        </Link>
      </div>
      <div className="h-full p-4">
        {/* {loading ? (
          <div>
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductListSkeleton key={index} />
            ))}
          </div>
        ) : ( */}
        <Table
          columns={columns}
          dataSource={productList}
          rowKey="id"
          pagination={false}
        />
        {/* )} */}
        <PaginationPage
          current={currentPage}
          total={totalProducts}
          pageSize={limitPerPage}
        />
      </div>
    </div>
  );
};

export default ProductsList;
