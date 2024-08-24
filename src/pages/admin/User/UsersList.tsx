import { useEffect, useState } from "react";
import {
  formartCurrency,
  hiddenSpinner,
  showSpinner,
} from "../../../util/util";
import { Link } from "react-router-dom";
import { Breadcrumb, Button, Image, Modal, Table, message } from "antd";
import { https } from "../../../config/axios";
import { IUser } from "../../../types/userType";
import { CiCircleAlert } from "react-icons/ci";
import { IoIosCheckboxOutline } from "react-icons/io";
import userService from "../../../services/userService";
import PaginationPage from "../../../components/PaginationPage/PaginationPage";
import UserListSkeleton from "../../../components/Skeleton/Admin/UserListSkeleton";

const UsersList: React.FC = () => {
  const params = new URLSearchParams(location.search);
  const [totalUsers, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const limitPerPage = 10;
  const currentPage = params.get("page") ? Number(params.get("page")) : 1;
  const [usersList, setUsersList] = useState<IUser[]>([]);

  const fetchData = async () => {
    showSpinner();
    try {
      const { data } = await userService.getAllUsers(limitPerPage, currentPage);
      setLoading(false);
      setUsersList(data.results);
      setTotalUser(data.totalResults);
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
      const data = await https.delete(`/users/${id}`);
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

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <Image
          src={record.image}
          alt={record.name}
          width={50}
          height={50}
          style={{ borderRadius: '8px' }}
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        <>
          <p>{record.email}</p>
          <div className="flex gap-1 items-center">
            {record.isEmailVerified ? (
              <>
                <IoIosCheckboxOutline color="green" />
                <span className="text-xs font-semibold text-slate-300">
                  Đã xác minh
                </span>
              </>
            ) : (
              <>
                <CiCircleAlert color="red" />
                <span className="text-xs font-semibold text-slate-300">
                  Chưa xác minh
                </span>
              </>
            )}
          </div>
        </>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text, record) => (
        <>
          <span>{record.phoneNumber}</span>
          <div className="flex gap-1 items-center">
            {record.isPhoneNumberVerified ? (
              <>
                <IoIosCheckboxOutline color="green" />
                <span className="text-xs font-semibold text-slate-300">
                  Đã xác minh
                </span>
              </>
            ) : (
              <>
                <CiCircleAlert color="red" />
                <span className="text-xs font-semibold text-slate-300">
                  Chưa xác minh
                </span>
              </>
            )}
          </div>
        </>
      ),
    },
    {
      title: 'Quận/Huyện',
      dataIndex: 'district',
      key: 'district',
      render: (text, record) => (
        <p>{record.shippingAddress[0]?.district || "..."}</p>
      ),
    },
    {
      title: 'Tỉnh/Thành phố',
      dataIndex: 'cityProvince',
      key: 'cityProvince',
      render: (text, record) => (
        <p>{record.shippingAddress[0]?.cityProvince || "..."}</p>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text, record) => (
        <div className="space-x-2">
          <Link
            to={`/admin/users/${record.id}`}
            className="text-yellow-500 hover:text-yellow-600"
          >
            Chi tiết
          </Link>
          <Button
            type="link"
            className="text-red-500 hover:text-red-600"
            onClick={() => showConfirm(record.id)}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><Link to="/admin">Trang chủ</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Người dùng</Breadcrumb.Item>
      </Breadcrumb>
      <Table columns={columns} dataSource={usersList} pagination={false} />

      <PaginationPage
        current={1}
        total={totalUsers}
        pageSize={limitPerPage} />
      {/* <div className="h-full overflow-x-auto">
        <div className="w-full border-gray-200 text-slate-500">
          <div className="w-full hidden lg:grid lg:grid-cols-10  gap-2">
            <div className="pr-6 pl-4 py-3  text-center font-bold uppercase text-slate-800">
              Ảnh
            </div>
            <div className="sm:col-span-2 pl-4 py-3  text-center font-bold uppercase text-slate-800">
              Tên người dùng
            </div>
            <div className="lg:block hidden col-span-2 pr-6 pl-2 py-3  text-left font-bold uppercase text-slate-800">
              Email
            </div>
            <div className="sm:block hidden  pl-2 py-3  text-left font-bold uppercase text-slate-800">
              SĐT
            </div>
            <div className="sm:block hidden  pl-2 py-3  text-left font-bold uppercase text-slate-800">
              Quận Huyện
            </div>
            <div className="sm:block hidden pl-2 py-3  text-left font-bold uppercase text-slate-800">
              Thành Phố
            </div>
            <div className="lg:block hidden  pl-2 py-3  text-left font-bold uppercase text-slate-800">
              Role
            </div>
            <div className="sm:block hidden pl-2 py-3  text-left font-bold uppercase text-slate-800">
              Thao tác
            </div>
          </div>
          <div>
            {[...usersList].reverse().map((user, index) => {
              return (
                <div
                  key={index}
                  className="relative grid lg:grid-cols-10 sm:grid-cols-5 grid-cols-3 gap-2 border-b border-slate-100 py-2"
                >
                  <div className="pl-4 mb-1">
                    <div className="px-2 py-1 min-w-[110px]">
                      <div>
                        <img
                          src={user.image}
                          className="mr-4 h-20 w-20 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:col-span-2">
                    <div className="flex flex-col justify-center">
                      <h6 className="text-base text-center">{user.name}</h6>
                    </div>
                  </div>
                  <div className="lg:block col-span-2 p-2">
                    <p className="text-sm ">
                      {user.email}
                    </p>
                    {user.isEmailVerified ? <div className="flex gap-1 items-center">
                      <IoIosCheckboxOutline color="green" />
                      <span className="text-xs font-semibold text-slate-300">Đã xác minh</span>
                    </div> : <div className="flex gap-1 items-center">
                      <CiCircleAlert color="red" />
                      <span className="text-xs font-semibold text-slate-300">Chưa xác minh</span>
                    </div>}
                  </div>
                  <div className="p-2">
                    <span className="text-sm font-semibold text-slate-400">
                      {user.phoneNumber}
                    </span>
                    {user.isPhoneNumberVerified ? <div className="flex gap-1 items-center">
                      <IoIosCheckboxOutline color="green" />
                      <span className="text-xs font-semibold text-slate-300">Đã xác minh</span>
                    </div> : <div className="flex gap-1 items-center">
                      <CiCircleAlert color="red" />
                      <span className="text-xs font-semibold text-slate-300">Chưa xác minh</span>
                    </div>}

                  </div>
                  <div className="p-2">
                    <p className="text-sm ">
                      {user.shippingAddress[0]?.district ? user.shippingAddress[0]?.district : "..."}
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="text-sm ">
                      {user.shippingAddress[0]?.cityProvince ? user.shippingAddress[0]?.cityProvince : "..."}
                    </p>
                  </div>
                  <div className="lg:block hidden p-2">
                    <p className="text-sm ">{user.role}</p>
                  </div>
                  <div className="absolute right-0 top-4 lg:block p-2 space-x-2 lg:static lg:top-auto lg:right-auto">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="text-sm font-semibold text-yellow-500 hover:text-yellow-600"
                    >
                      Chi tiết
                    </Link>
                    <button
                      onClick={() => showConfirm(user.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UsersList;
