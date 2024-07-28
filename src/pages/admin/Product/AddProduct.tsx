// type Props = {};
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Table,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hiddenSpinner, showSpinner } from "../../../util/util";
import { https } from "../../../config/axios";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from 'antd';
import type { GetProp } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

// const attributes = [
//   {
//     name: "Size",
//     values: [
//       { name: "S", image: "value.jpg" },
//       { name: "M", image: "value2.jpg" },
//       { name: "L", image: "value3.jpg" },
//       { name: "XL", image: "value4.jpg" },
//     ],
//   },
//   {
//     name: "Color",
//     values: [
//       { name: "Red" },
//       { name: "Green" },
//     ],
//   },
// ];

// const createVariants = (attributes) => {
//   const sizes = attributes.find(attr => attr.name === 'Size').values;
//   const colors = attributes.find(attr => attr.name === 'Color').values;

//   const variants = [];
//   colors.forEach((color, colorIndex) => {
//     sizes.forEach((size, sizeIndex) => {
//       variants.push({
//         color: color.name,
//         size: size.name,
//         originalPrice: '',
//         currentPrice: '',
//         stock: '',
//         tier_index: [colorIndex, sizeIndex]
//       });
//     });
//   });

//   return variants;
// };

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [checkboxCategoriesList, setCheckboxCategoriesList] = useState<any[]>([]);
  const [attributes, setAttributes] = useState([
    // { name: "", values: [{ name: "" }] }
  ]);
  const [showPriceAndStock, setShowPriceAndStock] = useState(true);
  const [variants, setVariants] = useState([]);
  const [columns, setColumns] = useState([]);
  const [attributeImages, setAttributeImages] = useState({});


  const [form] = Form.useForm();

  // Hàm tạo variants động dựa trên attributes
  const createVariants = (attributes) => {
    if (attributes.length < 1) return [];

    const attributeValues = attributes.map(attr => attr.values);
    const newVariants = [];

    const combineAttributes = (prefix = [], depth = 0) => {
      if (depth === attributeValues.length) {
        newVariants.push({
          attributes: prefix,
          originalPrice: '',
          currentPrice: '',
          stock: ''
        });
        return;
      }

      for (let value of attributeValues[depth]) {
        combineAttributes([...prefix, value.name], depth + 1);
      }
    };

    combineAttributes();
    return newVariants;
  };
  // const createVariants = (attributes) => {
  //   if (attributes.length < 1) return [];

  //   const attributeValues = attributes.map(attr => attr.values);
  //   const newVariants = [];

  //   const combineAttributes = (prefixNames = [], prefixIndices = [], depth = 0) => {
  //     if (depth === attributeValues.length) {
  //       const variant = {
  //         originalPrice: '',
  //         currentPrice: '',
  //         stock: '',
  //         tierIndex: prefixIndices,
  //       };

  //       prefixNames.forEach((name, index) => {
  //         variant[attributes[index].name.toLowerCase()] = name;
  //       });

  //       newVariants.push(variant);
  //       return;
  //     }

  //     for (let i = 0; i < attributeValues[depth].length; i++) {
  //       combineAttributes(
  //         [...prefixNames, attributeValues[depth][i].name],
  //         [...prefixIndices, i],
  //         depth + 1
  //       );
  //     }
  //   };

  //   combineAttributes();
  //   return newVariants;
  // };

  // Example usage:
  // const attributesTest = [
  //   { name: "Color", values: [{ name: "Red" }, { name: "Green" }] },
  //   { name: "Size", values: [{ name: "S" }, { name: "M" }, { name: "L" }] },
  // ];

  // const variantsTest = createVariants(attributesTest);
  // console.log(variantsTest);

  // Hàm tạo columns động dựa trên attributes
  // const createColumns = (attributes) => {
  //   const columns = attributes.map((attr, attrIndex) => ({
  //     title: attr.name,
  //     dataIndex: `attribute_${attrIndex}`,
  //     render: (text, _, index) => (
  //       <div className="text-center text-lg">
  //         <label htmlFor="">
  //           {variants[index]?.attributes[attrIndex]}
  //         </label>
  //       </div>
  //     ),
  //   }));

  //   columns.push(
  //     {
  //       title: 'Giá gốc',
  //       dataIndex: 'originalPrice',
  //       render: (text, _, index) => (
  //         <Form.Item
  //           name={['variants', index, 'originalPrice']}
  //           initialValue={variants[index]?.originalPrice}
  //           rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}
  //         >
  //           <Input
  //             placeholder="Giá gốc"
  //             onChange={e => handleInputChange(e.target.value, index, 'originalPrice')}
  //           />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: 'Giá khuyến mãi',
  //       dataIndex: 'currentPrice',
  //       render: (text, _, index) => (
  //         <Form.Item
  //           name={['variants', index, 'currentPrice']}
  //           initialValue={variants[index]?.currentPrice}
  //           rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi!' }]}
  //         >
  //           <Input
  //             placeholder="Giá khuyến mãi"
  //             onChange={e => handleInputChange(e.target.value, index, 'currentPrice')}
  //           />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: 'Kho hàng',
  //       dataIndex: 'stock',
  //       render: (text, _, index) => (
  //         <Form.Item
  //           name={['variants', index, 'stock']}
  //           initialValue={variants[index]?.stock}
  //           rules={[{ required: true, message: 'Vui lòng nhập kho hàng!' }]}
  //         >
  //           <Input
  //             placeholder="Kho hàng"
  //             onChange={e => handleInputChange(e.target.value, index, 'stock')}
  //           />
  //         </Form.Item>
  //       ),
  //     }
  //   );

  //   return columns;
  // };

  const createColumns = (attributes) => {
    const columns = [];

    if (attributes[0]) {
      columns.push({
        title: attributes[0].name,
        dataIndex: 'attribute_0',
        render: (text, _, index) => {
          const attributeValue = variants[index]?.attributes ? variants[index].attributes[0] : null;
          const rowSpan = attributes[1]?.values.length || 1;
          const attrValueIndex = index % rowSpan;

          return {
            children: (
              <>
                <div className="text-center text-lg">
                  <label htmlFor="">
                    {attributeValue}
                  </label>
                </div>

                <Form.Item
                  name={['variants', index, 'colorImage']}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                  rules={[{ required: true, message: 'Vui lòng tải hình ảnh!' }]}
                >
                  <Upload
                    onChange={({ fileList }) => handleUploadImageAttributeChange(fileList, attrValueIndex)}
                    listType="picture"
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                  </Upload>
                </Form.Item>
              </>
            ),
            props: {
              rowSpan: index % rowSpan === 0 ? rowSpan : 0,
            },
          };
        },
      });
    }

    if (attributes[1]) {
      columns.push({
        title: attributes[1].name,
        dataIndex: 'attribute_1',
        render: (text, _, index) => {
          const attributeValue = variants[index]?.attributes ? variants[index].attributes[1] : null;

          return (
            <div className="text-center text-lg">
              <label htmlFor="">
                {attributeValue}
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
          <Form.Item
            name={['variants', index, 'originalPrice']}
            initialValue={variants[index]?.originalPrice}
            rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}
          >
            <Input
              placeholder="Giá gốc"
              onChange={e => handleInputChange(e.target.value, index, 'originalPrice')}
            />
          </Form.Item>
        ),
      },
      {
        title: 'Giá khuyến mãi',
        dataIndex: 'currentPrice',
        render: (text, _, index) => (
          <Form.Item
            name={['variants', index, 'currentPrice']}
            initialValue={variants[index]?.currentPrice}
            rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi!' }]}
          >
            <Input
              placeholder="Giá khuyến mãi"
              onChange={e => handleInputChange(e.target.value, index, 'currentPrice')}
            />
          </Form.Item>
        ),
      },
      {
        title: 'Kho hàng',
        dataIndex: 'stock',
        render: (text, _, index) => (
          <Form.Item
            name={['variants', index, 'stock']}
            initialValue={variants[index]?.stock}
            rules={[{ required: true, message: 'Vui lòng nhập kho hàng!' }]}
          >
            <Input
              placeholder="Kho hàng"
              onChange={e => handleInputChange(e.target.value, index, 'stock')}
            />
          </Form.Item>
        ),
      }
    );

    return columns;
  };




  const handleInputAttributeNameChange = (value, index) => {
    setAttributes(prevAttributes => {
      const newAttributes = [...prevAttributes];
      // Kiểm tra và đảm bảo rằng newAttributes[index] tồn tại và là một đối tượng
      if (newAttributes[index]) {
        if (!newAttributes[index].hasOwnProperty('name')) {
          newAttributes[index].name = '';
        }
        newAttributes[index].name = value;
      } else {
        // Nếu newAttributes[index] không tồn tại, khởi tạo nó
        newAttributes[index] = { name: value, values: [] };
      }
      return newAttributes;
    });
    // console.log(attributes, 'attributes');
  };

  const handleInputAttributeValueChange = (value, fieldIndex, valueIndex, field) => {
    // console.log(value, fieldIndex, valueIndex, field)
    setAttributes(prevAttributes => {
      const newAttributes = [...prevAttributes];

      // Kiểm tra và khởi tạo đối tượng field nếu chưa tồn tại
      if (!newAttributes[fieldIndex]) {
        newAttributes[fieldIndex] = { values: [] };
      }

      // Kiểm tra và khởi tạo mảng values nếu chưa tồn tại
      if (!newAttributes[fieldIndex].values) {
        newAttributes[fieldIndex].values = [];
      }

      // Kiểm tra và khởi tạo đối tượng value nếu chưa tồn tại
      if (!newAttributes[fieldIndex].values[valueIndex]) {
        newAttributes[fieldIndex].values[valueIndex] = { name: "" };
      }

      // Cập nhật giá trị tại vị trí cụ thể
      newAttributes[fieldIndex].values[valueIndex][field] = value;

      // Xóa giá trị khỏi mảng nếu giá trị mới là rỗng
      if (value === "") {
        newAttributes[fieldIndex].values.splice(valueIndex, 1);
      }

      // console.log(attributes, 'attributes')
      // console.log(newAttributes, 'newAttributes')
      // console.log(variants, 'variants')

      return newAttributes;
    });
  };

  // const handleInputAttributeValueChange = (value, fieldIndex, valueIndex, field) => {
  //   setAttributes(prevAttributes => {
  //     const newAttributes = [...prevAttributes];

  //     // Kiểm tra và khởi tạo đối tượng field nếu chưa tồn tại
  //     if (!newAttributes[fieldIndex]) {
  //       newAttributes[fieldIndex] = { name: "", values: [] };
  //     }

  //     // Kiểm tra và khởi tạo mảng values nếu chưa tồn tại
  //     if (!newAttributes[fieldIndex].values) {
  //       newAttributes[fieldIndex].values = [];
  //     }

  //     // Kiểm tra và khởi tạo đối tượng value nếu chưa tồn tại
  //     if (!newAttributes[fieldIndex].values[valueIndex]) {
  //       newAttributes[fieldIndex].values[valueIndex] = { name: "" };
  //     }

  //     // Cập nhật giá trị tại vị trí cụ thể
  //     newAttributes[fieldIndex].values[valueIndex][field] = value;

  //     // Xóa giá trị khỏi mảng nếu giá trị mới là rỗng
  //     if (value === "") {
  //       newAttributes[fieldIndex].values.splice(valueIndex, 1);
  //     }

  //     console.log(attributes, 'attributes');
  //     console.log(newAttributes, 'newAttributes');
  //     console.log(variants, 'variants');

  //     return newAttributes;
  //   });
  // };
  const handleInputChange = (value, index, field) => {
    let updatedVariants; // Tạo biến để lưu trữ giá trị của newVariants
    // console.log(variants, 'variants')

    setVariants(prevVariants => {
      const newVariants = [...prevVariants];
      // console.log()
      newVariants[index][field] = value;
      updatedVariants = newVariants; // Lưu giá trị của newVariants vào biến updatedVariants
      return newVariants;
    });

    form.setFieldsValue({ variants: updatedVariants }); // Sử dụng updatedVariants để cập nhật form
  };

  const handleImageChange = (e, index) => {
    const newVariants = [...variants];
    newVariants[index].image = e.fileList;
    setVariants(newVariants);
  };

  const handleUploadImageAttributeChange = (fileList, attrValueIndex) => {
    setAttributeImages(prevImages => ({
      ...prevImages,
      [attrValueIndex]: fileList,
    }));
  };


  const fetchCategoryes = async () => {
    const { data } = await https.get("/categories");
    setCheckboxCategoriesList(data.results.map((category: any) => ({
      label: category.name,
      value: category.id,
    })));
  };

  useEffect(() => {
    fetchCategoryes();
    // form.setFieldsValue({ fields: [{ name: "", price: "", stock: "", discount: "", image: "" }] });
  }, []);

  // Cập nhật variants và columns khi attributes thay đổi
  useEffect(() => {
    if (attributes.length === 0) {
      setShowPriceAndStock(true);
    } else {
      setShowPriceAndStock(false);
      const newVariants = createVariants(attributes);
      setVariants(newVariants);
      const newColumns = createColumns(attributes);
      setColumns(newColumns);
    }
  }, [attributes]);

  // const onFieldsChange = (_, allFields) => {
  //   // console.log(allFields, 'allFields')
  //   const attributeFields = allFields.filter((field) => field.name[0] === 'attributes');
  //   console.log(attributeFields, 'attributeFields')
  //   // setShowPriceAndStock(attributeFields.length > 0);
  // };

  // useEffect(() => {
  //   console.log(form.getFieldsValue(), 'form.getFieldsValue()')
  // }, [form.getFieldsValue()]);

  // useEffect(() => {
  //   const initialFields = form.getFieldValue("attributes") || [];
  //   console.log(initialFields, 'initialFields')
  //   setShowPriceAndStock(initialFields.length > 0);
  // }, [form]);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    // console.log(attributeImages, 'attributeImages')
    if (variants) {
      console.log(variants, 'variants')
      const convertDataToDesiredFormat = (data, attributes) => {
        return data.map(variant => {
          const tierIndex = variant.attributes.map((attrValue, index) => {
            // console.log('123')
            const attrIndex = attributes[index].values.findIndex(value => value.name === attrValue);
            return attrIndex;
          });

          return {
            tier_index: tierIndex,
            currentPrice: variant.currentPrice,
            originalPrice: variant.originalPrice,
            stock: variant.stock
          };
        });
      };

      const convertedData = convertDataToDesiredFormat(variants, attributes);
      console.log('Converted data:', convertedData);

    }

    return
    const formValues = {
      ...values,
      variants: variants.map((variant, index) => ({
        ...variant,
        tier_index: [variant.tier_index[0], variant.tier_index[1]]
      }))
    };
    console.log('Form values:', formValues);


    const formattedVariants = variants.map(({ tier_index, currentPrice, originalPrice, stock }) => ({
      tier_index,
      currentPrice,
      originalPrice,
      stock,
    }));
    console.log("Formatted Submit values:", { variants: formattedVariants });


    const body = {
      ...values,
      variants: formattedVariants,
    }

    console.log('Body:', body);
    return
    const postProduct = async () => {
      showSpinner();
      const attributeData: any = [];
      let formDataAttributeImage = new FormData();
      // console.log(values.fields, 'values.fields')
      // return;
      for (const field of values.fields) {
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

      // console.log(values, 'values');
      // console.log(attributeData, 'attributeData');
      // console.log('123')
      // return;

      const listFiles = values.gallery;
      const thumbnail: any = values.thumbnail;


      const newArrayFiles = listFiles.map((file: any) => file.originFileObj);
      const thumbnailFile = thumbnail[0].originFileObj;

      const formData = new FormData();
      for (const file of newArrayFiles) {
        formData.append("images", file);
      }

      const formDataThumbnail = new FormData();
      formDataThumbnail.append("images", thumbnailFile);
      try {
        const { data: dataGallery } = await https.post("/images", formData);
        const urlGallery: { url: string; publicId: string }[] = dataGallery.data;

        const { data: dataThumbnail } = await https.post("/images", formDataThumbnail);
        const urlThumbnail: { url: string; publicId: string }[] = dataThumbnail.data;

        const data = {
          name: values.name,
          description: values.description,
          gallery: urlGallery.map((image) => image.url),
          thumbnail: urlThumbnail[0].url,
          categories: values.categories,
          attributes: attributeData,
          video: "",
        };

        const res = await https.post("/products", data);
        if (res) {
          message.success("Thêm sản phẩm thành công!");
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

  const onReset = () => {
    form.resetFields();
  };


  return (
    <div className="w-full mx-auto px-5 pb-5">
      <h3 className=" text-2xl text-slate-700 text-center mt-6 mb-3">
        Thêm mới
      </h3>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={false}
      // onFieldsChange={onFieldsChange}
      >
        <div className="">
          <div className="grid xl:grid-cols-2 xl:gap-10">
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
              >
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Chọn danh mục"
                  options={checkboxCategoriesList}
                />
              </Form.Item>
            </div>
            <div>
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
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload.Dragger>
              </Form.Item>
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
                          if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                            return Promise.reject("File phải có định dạng png, jpg, jpeg!");
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

          {showPriceAndStock && (
            <div>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <Input placeholder="Giá" />
              </Form.Item>
              <Form.Item
                name="stock"
                label="Kho hàng"
                rules={[{ required: true, message: 'Vui lòng nhập kho hàng!' }]}
              >
                <Input placeholder="Kho hàng" />
              </Form.Item>
            </div>
          )}

          <div className="">
            <Form.List
              name="attributes"
              initialValue={attributes}
            >
              {(fields, { add, remove }) => (
                <div>
                  <h2 className="text-[20px] my-5 font-medium">Phân loại hàng</h2>

                  {fields.map((field, fieldIndex) => (
                    <div key={field.key} className="mb-10 bg-slate-50 p-5">
                      <div className="w-[600px]">
                        {fields.length > 0 && (
                          <Button
                            className="dynamic-delete-button bg-red-800 text-white my-4"
                            onClick={() => {
                              // console.log(fields, 'fields')

                              remove(field.name);
                              // console.log(fields, 'fields')
                              if (fields.length === 1) {
                                setShowPriceAndStock(true);
                              }
                            }}
                            icon={<MinusCircleOutlined />}
                          >
                            Xóa thuộc tính
                          </Button>
                        )}
                        <div className="flex gap-4 mt-4">
                          <div className="w-[130px]">
                            <label htmlFor="" className="text-[16px] font-normal max-w-[130px]">Nhóm phân loại {fieldIndex + 1}</label>
                          </div>
                          <div className="">
                            <Form.Item
                              name={[field.name, "name"]}
                              rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
                            >
                              <Input onChange={(e) => handleInputAttributeNameChange(e.target.value, fieldIndex)} placeholder="Tên phân loại hàng" />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <Form.List name={[field.name, "values"]}>
                        {(valueFields, { add: addValue, remove: removeValue }) => (
                          <div className="flex gap-4 mt-5">
                            <div className="flex flex-col w-[130px]">
                              <label className="text-[16px] font-normal" htmlFor="">Phân loại hàng</label>
                              <Button className="mt-2" type="dashed" onClick={() => addValue()} icon={<PlusOutlined />}>
                                Thêm
                              </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              {valueFields.map((valueField, valueIndex) => (
                                <div key={valueField.key} className="min-w-[302px]">
                                  <Form.Item
                                    name={[valueField.name, "name"]}
                                    label={`Giá trị ${valueIndex + 1}`}
                                    rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
                                  >
                                    <Input
                                      placeholder={`Giá trị ${valueIndex + 1}`}
                                      onChange={(e) => handleInputAttributeValueChange(e.target.value, fieldIndex, valueIndex, "name")}
                                    />
                                  </Form.Item>
                                  <div className="">
                                    <Button
                                      className="dynamic-delete-button bg-red-500 text-white"
                                      onClick={() => {
                                        removeValue(valueField.name);
                                        handleInputAttributeValueChange("", fieldIndex, valueIndex, "name"); // Cập nhật attributes khi xóa
                                      }}
                                      icon={<MinusCircleOutlined />}
                                    >
                                      Xóa
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Form.List>
                    </div>
                  ))}
                  <Button className="mb-4" type="dashed" onClick={() => {
                    add({ name: '', values: [] });
                    // console.log(fields, 'fields')
                    setShowPriceAndStock(false)
                  }} icon={<PlusOutlined />}>
                    Thêm phân loại hàng
                  </Button>
                </div>
              )}
            </Form.List>
          </div>


          <Table
            className="custom-table"
            columns={createColumns(attributes)}
            dataSource={variants}
            pagination={false}
            rowKey={(record, index) => index}
          />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="text-white bg-green-500"
              >
                Thêm mới
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

export default AddProduct;