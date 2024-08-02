// type Props = {};
import {
    Button,
    Divider,
    Form,
    Image,
    Input,
    Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hiddenSpinner, showSpinner } from "../../../util/util";
import { https } from "../../../config/axios";
import TextArea from "antd/es/input/TextArea";
import { BsDot } from "react-icons/bs";

const ProductDetail: React.FC = () => {
    window.scrollTo(0, 0);
    const { id } = useParams();
    const [galleryList, setGalleryList] = useState<string[]>([]);
    const [product, setProduct] = useState<any>({}); // product detail
    const [form] = Form.useForm();

    const attribute = product.attributes;
    const variants = product.variants;

    let selectedCategories: any = [];

    const columns = [
        {
            title: "Tồn kho",
            dataIndex: "countInStock",
            key: "countInStock",
        },
        {
            title: "Lượt mua",
            dataIndex: "purchases",
            key: "purchases",
        },
        {
            title: "Lượt thích",
            dataIndex: "likes",
            key: "likes",
        },
        {
            title: "Lượt đánh giá",
            dataIndex: "numReviews",
            key: "numReviews",
        },
        {
            title: "Điểm đánh giá",
            dataIndex: "scoreReview",
            key: "scoreReview",
        },
        {
            title: "Điểm đánh giá cuối cùng",
            dataIndex: "finalScoreReview",
            key: "finalScoreReview",
        }
    ];

    const createColumnsAttribute = (attributes) => {
        const columns = [];

        // if (attributes[0]) {
        //     columns.push({
        //         title: attributes[0].name,
        //         dataIndex: 'attribute_0',
        //         render: (text, _, index) => {
        //             const attributeValue = variants[index]?.attributes ? variants[index].attributes[0] : null;
        //             const rowSpan = attributes[1]?.values.length || 1;
        //             // const attrValueIndex = index % rowSpan;
        //             // Calculate the correct attribute value index
        //             const attrValueIndex = Math.floor(index / (attributes[1]?.values.length || 1));
        //             const currentValue = attributes[0]?.values[attrValueIndex] || {};

        //             return {
        //                 children: (
        //                     <>
        //                         <div className="text-center text-lg">
        //                             <label htmlFor="">
        //                                 {attributeValue}
        //                             </label>
        //                         </div>

        //                         {/* <Form.Item
        //               name={['variants', index, 'colorImage']}
        //               valuePropName="fileList"
        //               getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
        //               rules={[{ required: true, message: 'Vui lòng tải hình ảnh!' }]}
        //             >
        //               <Upload
        //                 onChange={({ fileList }) => handleUploadImageAttributeChange(fileList, attrValueIndex)}
        //                 listType="picture"
        //                 beforeUpload={() => false}
        //                 maxCount={1}
        //               // defaultFileList={currentValue.image ? [{ thumbUrl: currentValue.image }] : []}
        //               >
        //                 <Button icon={<UploadOutlined />}>Tải lên</Button>
        //               </Upload>
        //             </Form.Item> */}
        //                     </>
        //                 ),
        //                 props: {
        //                     rowSpan: index % rowSpan === 0 ? rowSpan : 0,
        //                 },
        //             };
        //         },
        //     });
        // }

        // if (attributes[1]) {
        //     columns.push({
        //         title: attributes[1].name,
        //         dataIndex: 'attribute_1',
        //         render: (text, _, index) => {
        //             const attributeValue = variants[index]?.attributes ? variants[index].attributes[1] : null;

        //             return (
        //                 <div className="text-center text-lg">
        //                     <label htmlFor="">
        //                         {attributeValue}
        //                     </label>
        //                 </div>
        //             );
        //         },
        //     });
        // }
        if (attributes?.[0]) {
            columns.push({
                title: attributes[0].name,  // "Màu"
                dataIndex: 'attribute_0',
                render: (text, _, index) => {
                    // Determine the row span for merging cells
                    const rowSpan = attributes[1]?.values.length || 1;

                    // Calculate the correct attribute value index based on the row span
                    const attrValueIndex = Math.floor(index / rowSpan);

                    // Safely access the variant and its tier_index
                    const variant = variants[index];
                    const tierIndex = variant?.tier_index;

                    // Safely find the current value using the tierIndex
                    const currentValue = attributes[0]?.values.find(
                        (val) => tierIndex && val._id === tierIndex[0] // Check that tierIndex exists and has an element at index 0
                    ) || {};

                    return {
                        children: (
                            <>
                                <div className="text-center text-lg">
                                    <label htmlFor="">
                                        {currentValue.name || 'N/A'}  {/* Display the name of the color */}
                                    </label>
                                </div>
                                {currentValue.image && (
                                    <div className="flex justify-center py-2">
                                        <Image className="" height={100} width={100} src={currentValue.image} alt={currentValue.name} />
                                    </div>
                                )}
                            </>
                        ),
                        props: {
                            rowSpan: index % rowSpan === 0 ? rowSpan : 0,  // Merge cells for the first attribute
                        },
                    };
                },
            });
        }

        if (attributes?.[1]) {
            columns.push({
                title: attributes[1].name,  // "Size"
                dataIndex: 'attribute_1',
                render: (text, _, index) => {
                    // Safely access the variant and its tier_index
                    const variant = variants[index];
                    const tierIndex = variant?.tier_index;

                    // Safely find the current value using the tierIndex
                    const currentValue = attributes[1]?.values.find(
                        (val) => tierIndex && val._id === tierIndex[1] // Check that tierIndex exists and has an element at index 1
                    ) || {};

                    return (
                        <div className="text-left text-lg">
                            <label htmlFor="">
                                {currentValue.name || 'N/A'}  {/* Display the size name */}
                            </label>
                        </div>
                    );
                },
            });
        }



        columns.push(
            {
                title: 'Giá gốc',
                dataIndex: 'originalPrice',
                render: (text, _, index) => (
                    <div className="flex justify-left items-center">
                        <span className="text-xl">{variants[index]?.originalPrice}</span>
                    </div>
                ),
            },
            {
                title: 'Giá khuyến mãi',
                dataIndex: 'currentPrice',
                render: (text, _, index) => (
                    <div className="flex justify-left items-center">
                        <span className="text-xl">{variants[index]?.currentPrice}</span>
                    </div>
                ),
            },
            {
                title: 'Kho hàng',
                dataIndex: 'stock',
                render: (text, _, index) => (
                    <div className="flex justify-left items-center">
                        <span className="text-xl">{variants[index]?.stock}</span>
                    </div>
                ),
            }
        );

        return columns;
    };

    const fetchProductDetail = async () => {
        showSpinner();
        try {
            const { data } = await https.get(`/products/${id}`);
            setProduct(data);
            console.log(data)
            const productDetail: any = data;
            form.setFieldsValue({
                name: productDetail.name,
                description: productDetail.description,
                shortDescription: productDetail.shortDescription
            });
            selectedCategories = productDetail.categories.map((category: any) => category.id);
            setGalleryList(productDetail.gallery);
            form.setFieldsValue({ categories: selectedCategories });

            form.setFieldValue('thumbnail', [{
                uid: '-1',
                name: productDetail.thumbnail,
                status: 'done',
                url: productDetail.thumbnail,
                type: `image/${productDetail.thumbnail.split('.').pop()}`,
                // originFileObj: new File(
                //   [productDetail.thumbnail],
                //   productDetail.thumbnail,
                //   { type: `image/${productDetail.thumbnail.split('.').pop()}` })
            }]);
            form.setFieldsValue({
                gallery: productDetail.gallery.map((url: string, index: number) => ({
                    uid: index,
                    name: url,
                    status: 'done',
                    url,
                    type: `image/${url.split('.').pop()}`
                }))
            });
            form.setFieldsValue({
                fields: productDetail.attributes.map((attribute: any, index: number) => ({
                    name: attribute.name,
                    price: attribute.price,
                    stock: attribute.stock,
                    discount: attribute.discount,
                    image: [{
                        uid: index,
                        name: attribute.image,
                        status: 'done',
                        url: attribute.image,
                        type: `image/${attribute.image.split('.').pop()}`
                    }]
                }))
            });

            // console.log(productDetail.thumbnail.split('.').pop(), 'type thumbnail')
            hiddenSpinner();
        } catch (error) {
            hiddenSpinner();
            console.log(error);
        }
    };
    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    return (
        <>
            <div className="w-full px-5 pb-2">
                <h3 className="text-2xl text-slate-700 text-center mt-6 mb-3">
                    Chi tiết sản phẩm
                </h3>
                <div className="my-4 flex gap-2">
                    <Link
                        to={`/admin/products/update/${id}`}
                        className=""
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="text-white bg-green-500"
                        >
                            Cập nhật thông tin chung
                        </Button>
                    </Link>
                    <Link
                        to={`/admin/products/update/attributes/${id}`}
                        className=""
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="text-white bg-blue-500"
                        >
                            Cập nhật phân loại hàng
                        </Button>
                    </Link>
                    <Link
                        to={`/admin/reviews/${id}`}
                        className=""
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="text-white bg-yellow-500"
                        >
                            Xem đánh giá
                        </Button>
                    </Link>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: '100%' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    requiredMark={false}
                >
                    <div className="mb-6">
                        <div className="mb-2 xl:grid xl:grid-cols-2 xl:gap-10">
                            <div>
                                <Form.Item
                                    label="Tên sản phẩm"
                                    name="name"
                                >
                                    <TextArea readOnly />
                                </Form.Item>

                                <Form.Item
                                    label="Mô tả ngắn"
                                    name="shortDescription"
                                >
                                    <TextArea rows={4} readOnly />
                                </Form.Item>

                                <Form.Item
                                    label="Mô tả đầy đủ"
                                    name="description"
                                >
                                    <TextArea rows={4} readOnly />
                                </Form.Item>

                                <div className="mb-2">
                                    <label htmlFor="">Danh mục</label>
                                    {product?.categories?.map((category: any) => (
                                        <div className="flex items-center">
                                            <BsDot />
                                            <span className="ml-2">{category.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                {/* thumbnail */}
                                <div>
                                    <div className="mb-2">
                                        <label htmlFor="">Ảnh thu nhỏ sản phẩm</label>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        <div className="">
                                            <Image className="" height={100} width={100} src={product.thumbnail} />
                                        </div>
                                    </div>
                                </div>
                                {/* gallery */}
                                <div>
                                    <div className="mb-2">
                                        <label htmlFor="">Bộ sưu tập hình ảnh sản phẩm</label>
                                    </div>
                                    <div className="flex gap-3">
                                        {galleryList?.map((image, index) => (
                                            <div className="">
                                                <Image className="" key={index} height={100} src={image} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2">
                                        <label htmlFor="">Video</label>
                                    </div>
                                    <video width="320" height="240" controls>
                                        <source src={product.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>


                        <div className="">
                            <Form.List name="fields">
                                {(fields) => {
                                    return (
                                        <div className="xl:grid xl:grid-cols-2 xl:gap-2">
                                            {fields.map((field, index) => (
                                                <div className="" key={field.key}>
                                                    <Divider>Thuộc tính {index + 1}</Divider>
                                                    <div className="sm:flex sm:gap-10 sm:gap-1">
                                                        <div>
                                                            <div className="mb-2">
                                                                <label htmlFor="">Ảnh</label>
                                                            </div>
                                                            <div className="">
                                                                <div className="">
                                                                    <Image className="" height={100} src={product.attributes[index].image} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Form.Item
                                                                name={[index, "name"]}
                                                                label="Tên thuộc tính"
                                                            >
                                                                <Input placeholder="" readOnly />
                                                            </Form.Item>
                                                            <div className="grid grid-cols-3 sm:gap-2 gap-1">
                                                                <Form.Item
                                                                    name={[index, "price"]}
                                                                    label="Giá"
                                                                >
                                                                    <Input placeholder="" readOnly />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    name={[index, "stock"]}
                                                                    label="Tồn kho"
                                                                >
                                                                    <Input placeholder="" readOnly />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    name={[index, "discount"]}
                                                                    label="Giảm giá"
                                                                >
                                                                    <Input placeholder="" readOnly />
                                                                </Form.Item>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }}
                            </Form.List>

                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={[product]}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />

                    <h3 className="text-2xl text-slate-700 text-center mt-10 mb-6">
                        Phân loại hàng
                    </h3>
                    <Table
                        // className="custom-table"
                        columns={createColumnsAttribute(attribute)}
                        dataSource={variants}
                        pagination={false}
                        bordered
                        rowKey={(record, index) => index}
                    />


                </Form>


            </div>

        </>
    );
};

export default ProductDetail;
