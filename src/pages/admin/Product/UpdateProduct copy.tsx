// type Props = {};
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hiddenSpinner, showSpinner } from "../../../util/util";
import { https } from "../../../config/axios";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from 'antd';
import type { GetProp } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "../../../App.css";

const UpdateProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkboxCategoriesList, setCheckboxCategoriesList] = useState<any[]>([]);
  const [form] = Form.useForm();

  let selectedCategories: any = [];

  const fetchProductDetail = async () => {
    window.scrollTo(0, 0);
    showSpinner();
    try {
      const { data } = await https.get(`/products/${id}`);
      console.log(data)
      const product: any = data;
      form.setFieldsValue({
        name: product.name,
        description: product.description
      });
      selectedCategories = product.categories.map((category: any) => category.id);
      form.setFieldsValue({ categories: selectedCategories });

      form.setFieldValue('thumbnail', [{
        uid: '-1',
        name: `thumbnail.${product?.thumbnail?.split('.')?.pop()}`,
        status: 'done',
        url: product.thumbnail,
        type: `image/${product?.thumbnail?.split('.')?.pop()}`,
        // thumbUrl: product.thumbnail,
        // originFileObj: new File(
        //   [product.thumbnail],
        //   product.thumbnail,
        //   { type: `image/${product.thumbnail.split('.').pop()}` })
      }]);
      form.setFieldsValue({
        gallery: product.gallery.map((url: string, index: number) => ({
          uid: index,
          name: `image${index + 1}.${url?.split('.')?.pop()}`,
          status: 'done',
          url,
          type: `image/${url?.split('.')?.pop()}`
        }))
      });
      form.setFieldsValue({
        fields: product.attributes.map((attribute: any, index: number) => ({
          name: attribute.name,
          price: attribute.price,
          stock: attribute.stock,
          discount: attribute.discount,
          image: [{
            uid: index,
            name: `image.${attribute.image.split('.').pop()}`,
            status: 'done',
            url: attribute.image,
            type: `image/${attribute.image.split('.').pop()}`
          }]
        }))
      });

      // console.log(product.thumbnail.split('.').pop(), 'type thumbnail')
      hiddenSpinner();
    } catch (error) {
      hiddenSpinner();
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProductDetail();
    fetchCategoryes();
  }, [id]);

  const fetchCategoryes = async () => {
    const { data } = await https.get("/categories");
    setCheckboxCategoriesList(data.results.map((category: any) => ({
      label: category.name,
      value: category.id,
    })))
  };




  const onFinish = (values: any) => {
    console.log(values, 'values')
    // return;
    const postProduct = async () => {
      showSpinner();
      const attributeData: any = [];
      let formDataAttributeImage = new FormData();
      // console.log(values.fields, 'values.fields')
      // return;
      for (const field of values.fields) {
        if (field.image[0].status === 'done') {
          const attribute = {
            name: field.name,
            price: field.price,
            stock: field.stock,
            discount: field.discount,
            image: field.image[0].url,
          };
          attributeData.push(attribute);
        } else {
          const image = field.image[0].originFileObj;
          formDataAttributeImage.append("images", image);
          try {
            const { data: dataAttributeImage } = await https.post("/images", formDataAttributeImage);
            const urlAttributeImage: { url: string; publicId: string }[] = dataAttributeImage.data;
            const attribute = {
              name: field.name,
              price: field.price,
              stock: field.stock,
              discount: field.discount,
              image: urlAttributeImage[0].url,
            };
            attributeData.push(attribute);
            formDataAttributeImage = new FormData();
          } catch (error) {
            console.log(error);
            message.error(error.response.data.message);
          }
        }
      }

      console.log(attributeData, 'attributeData')
      // return;

      let urlGallery: any[] = [];
      const listFiles: any[] = [];
      for (const file of values.gallery) {
        if (file.status === 'done') {
          urlGallery.push({ url: file.url });
        } else {
          listFiles.push(file);
        }
      }
      if (listFiles.length > 0) {
        const newArrayFiles = listFiles.map((file: any) => file.originFileObj);
        const formData = new FormData();
        for (const file of newArrayFiles) {
          formData.append("images", file);
        }
        try {
          const { data: dataGallery } = await https.post("/images", formData);
          const urlArray: { url: string; publicId: string }[] = dataGallery.data;
          urlGallery.push(...urlArray);
        } catch (error) {
          hiddenSpinner();
          console.log(error);
          message.error(error.response.data.message);
        }
      }

      let urlThumbnail: any[] = [];
      if (values.thumbnail[0].status === 'done') {
        urlThumbnail.push({ url: values.thumbnail[0].url });
      } else {
        const thumbnailFile = values.thumbnail[0].originFileObj;
        const formDataThumbnail = new FormData();
        formDataThumbnail.append("images", thumbnailFile);
        try {
          const { data: dataThumbnail } = await https.post("/images", formDataThumbnail);
          const urlArray: { url: string; publicId: string }[] = dataThumbnail.data;
          urlThumbnail = urlArray;
        } catch (error) {
          hiddenSpinner();
          console.log(error);
          message.error(error.response.data.message);
        }
      }

      try {
        const data = {
          name: values.name,
          description: values.description,
          gallery: urlGallery.map((image) => image.url),
          thumbnail: urlThumbnail[0].url,
          categories: values.categories,
          attributes: attributeData,
          video: "",
        };

        // console.log(data, 'data');
        // return;
        // console.log(data);
        // return;

        const res = await https.put(`/products/${id}`, data);
        if (res) {
          message.success("Cập nhật phẩm thành công!");
          navigate("/admin/products");
          hiddenSpinner();
        }
      } catch (error) {
        hiddenSpinner();
        console.log(error);
        message.error(error.response.data.message);
      }
    };
    postProduct();
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  const onCategoryChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    // console.log('checked = ', checkedValues);
    selectedCategories = checkedValues;
    // console.log(selectedCategories, 'selectedCategories2')
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="w-full mx-auto px-5">
      <h3 className=" text-2xl text-slate-700 text-center mt-6 mb-3">
        Cập nhật
      </h3>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        style={{}}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={false}
      >
        <div className="">
          <div className="xl:grid xl:grid-cols-2 xl:gap-10">
            <div>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="categories"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
                className=""
              >
                {/* <Checkbox.Group className="grid grid-cols-2 gap-y-2 items-center" options={checkboxCategoriesList} onChange={onCategoryChange} /> */}
                <Select
                  mode="multiple"
                  style={{}}
                  placeholder="select one country"
                  onChange={onCategoryChange}
                  options={checkboxCategoriesList}
                />
              </Form.Item>
            </div>

            <div className="">
              {/* thumbnail */}
              <Form.Item
                label="Ảnh thu nhỏ"
                name="thumbnail"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                rules={[
                  { required: true, message: "Vui lòng chọn file!" },
                  {
                    validator(_, fileList) {
                      if (fileList && fileList.length > 0) {
                        const file = fileList[0];
                        if (file.size > 1024 * 1024) {
                          return Promise.reject("File tối đa 1MB");
                        }
                        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                          return Promise.reject("File phải có định dạng png, jpg, jpeg!");
                        }
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Upload.Dragger
                  className="customSizedUpload"
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1} // chỉ cho phép tải lên một file duy nhất
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload.Dragger>
              </Form.Item>
              {/* gallery */}
              <Form.Item
                label="Bộ sưu tập hình ảnh"
                name="gallery"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[
                  { required: true, message: "Vui lòng chọn file!" },
                  {
                    validator(_, fileList) {
                      if (fileList) {
                        if (fileList.length > 5) {
                          return Promise.reject("Tối đa 5 file!");
                        }
                        for (const file of fileList) {
                          if (file.size > 1024 * 1024) {
                            return Promise.reject("File tối đa 1MB");
                          }
                          if (
                            !["image/jpeg", "image/jpg", "image/png"].includes(
                              file.type
                            )
                          ) {
                            return Promise.reject(
                              "File phải có định dạng png, jpg, jpeg!"
                            );
                          }
                        }
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Upload.Dragger
                  multiple
                  listType="picture"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload.Dragger>
              </Form.Item>

            </div>

          </div>

          <div className="">
            <Form.List name="fields">
              {(fields, { add, remove }) => {
                return (
                  <div className="">
                    {fields.map((field, index) => (
                      <div key={field.key}>
                        <Divider>Thuộc tính {index + 1}</Divider>
                        <div className="grid xl:grid-cols-2 xl:gap-4">
                          <div>
                            <Form.Item
                              name={[index, "name"]}
                              label="Tên thuộc tính"
                              rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
                            >
                              <Input placeholder="" />
                            </Form.Item>
                            <div className="grid grid-cols-3 sm:gap-2 gap-1">
                              <Form.Item
                                name={[index, "price"]}
                                label="Giá gốc"
                                rules={[{ required: true, message: "Vui lòng nhập trường này!" },
                                {
                                  pattern: /^[0-9]*$/,
                                  message: "Vui lòng nhập số dương!",
                                }
                                ]}
                              >
                                <Input placeholder="" />
                              </Form.Item>
                              <Form.Item
                                name={[index, "stock"]}
                                label="Tồn kho"
                                rules={[{ required: true, message: "Vui lòng nhập trường này!", },
                                {
                                  pattern: /^[0-9]*$/,
                                  message: "Vui lòng nhập số dương!",
                                }
                                ]}
                              >
                                <Input placeholder="" />
                              </Form.Item>
                              <Form.Item
                                name={[index, "discount"]}
                                label="Giá khuyến mãi"
                                rules={[{ required: true, message: "Vui lòng nhập trường này!" },
                                {
                                  pattern: /^[0-9]*$/,
                                  message: "Vui lòng nhập số dương!",
                                }
                                ]}
                              >
                                <Input placeholder="" />
                              </Form.Item>
                            </div>
                          </div>
                          <Form.Item
                            label="Ảnh"
                            name={[index, "image"]}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                            rules={[
                              { required: true, message: "Vui lòng chọn file!" },
                              {
                                validator(_, fileList) {
                                  if (fileList && fileList.length > 0) {
                                    const file = fileList[0];
                                    if (file.size > 1024 * 1024) {
                                      return Promise.reject("File tối đa 1MB");
                                    }
                                    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                                      return Promise.reject("File phải có định dạng png, jpg, jpeg!");
                                    }
                                    return Promise.resolve();
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Upload.Dragger
                              listType="picture"
                              beforeUpload={() => false}
                              maxCount={1} // chỉ cho phép tải lên một file duy nhất
                            >
                              <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload.Dragger>
                          </Form.Item>
                        </div>
                        {fields.length > 1 ? (
                          <Button
                            className="dynamic-delete-button bg-red-500 text-white"
                            onClick={() => remove(field.name)}
                            icon={<MinusCircleOutlined />}
                          >
                            Xóa thuộc tính
                          </Button>
                        ) : null}
                      </div>
                    ))}
                    <Divider />
                    {fields.length < 20 && (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ width: "60%" }}
                          className="flex items-center justify-center border-green-500 text-green-500 m-auto"
                        >
                          <PlusOutlined /> Thêm thuộc tính
                        </Button>
                      </Form.Item>
                    )}
                  </div>
                );
              }}
            </Form.List>

          </div>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="text-white bg-green-500"
              >
                Cập nhật
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>

        </div>


      </Form>
    </div>
  );
};

export default UpdateProduct;
