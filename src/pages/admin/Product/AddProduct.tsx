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

// Xem attribute có chứa values: [{ name: "" }] không, mục đích render table
// Hàm kiểm tra
const containsDefaultValues = (attributes) => {
  const defaultValues = [{ name: "" }];

  return attributes.some(attribute => {
    return isEqual(attribute.values, defaultValues);
  });
};

// Hàm so sánh đơn giản chỉ kiểm tra values
const isEqual = (a, b) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i].name) return false;
  }

  return true;
};

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
    { name: "", values: [{ name: "" }] }
  ]);
  // const [showPriceAndStock, setShowPriceAndStock] = useState(true);
  const [variants, setVariants] = useState([]);
  const [columns, setColumns] = useState([]);
  const [attributeImages, setAttributeImages] = useState({});

  // const [inputValues, setInputValues] = useState({
  //   price: "",
  //   discount: "",
  //   stock: ""
  // });


  const [form] = Form.useForm();

  // Hàm tạo variants động dựa trên attributes
  const createVariants = (attributes) => {
    // if (!attributes[1]?.name && attributes[1]?.values.length < 0) return variants;
    if (attributes.length < 1) return [];


    const attributeValues = attributes.map(attr => attr.values);
    // const attributeValues = attributes.map(attr => attr.values.length > 0 ? attr.values : [{ name: '' }]);
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
  //   // If there are no attributes or the first attribute is not filled, return an empty array
  //   if (attributes.length < 1) return [];

  //   // If the second attribute exists but doesn't have a name or values, return the existing variants
  //   if (attributes[1] && (!attributes[1].name || attributes[1].values.length === 0)) {
  //     console.log('return variants')
  //     return variants;
  //   }

  //   const attributeValues = attributes.map(attr => attr.values);
  //   const newVariants = [];

  //   const combineAttributes = (prefix = [], depth = 0) => {
  //     if (depth === attributeValues.length) {
  //       newVariants.push({
  //         attributes: prefix,
  //         originalPrice: '',
  //         currentPrice: '',
  //         stock: ''
  //       });
  //       return;
  //     }

  //     for (let value of attributeValues[depth]) {
  //       combineAttributes([...prefix, value.name], depth + 1);
  //     }
  //   };

  //   combineAttributes();
  //   return newVariants;
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

      console.log(variants, 'handleInputAttributeValueChange')
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
    // console.log(variants, 'handleInputChange')
    let updatedVariants; // Tạo biến để lưu trữ giá trị của newVariants
    // console.log(variants, 'variants')

    setVariants(prevVariants => {
      const newVariants = [...prevVariants];
      // console.log()
      newVariants[index][field] = value;
      updatedVariants = newVariants; // Lưu giá trị của newVariants vào biến updatedVariants
      return newVariants;
    });

    // form.setFieldsValue({ variants: updatedVariants }); // Sử dụng updatedVariants để cập nhật form
    console.log(variants, 'handleInputChange')
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

  // const mergeVariants = (oldVariants, newVariants) => {
  //   if (attributes[1] && (!attributes[1].name || attributes[1].values.length === 0)) {
  //     console.log('return')
  //     return newVariants;
  //   }
  //   return newVariants.map(newVariant => {
  //     const matchingOldVariant = oldVariants.find(oldVariant => {
  //       if (!oldVariant.attributes || !newVariant.attributes) return false;

  //       return oldVariant.attributes.every((attr, index) =>
  //         attr === newVariant.attributes[index]
  //       );
  //     });

  //     if (matchingOldVariant) {
  //       return { ...newVariant, ...matchingOldVariant };
  //     }

  //     return newVariant;
  //   });
  // };

  const mergeVariants = (oldVariants, newVariants) => {
    return newVariants.map(newVariant => {
      // Find a matching old variant where all attributes match exactly
      const matchingOldVariant = oldVariants.find(oldVariant =>
        JSON.stringify(oldVariant.attributes) === JSON.stringify(newVariant.attributes)
      );

      if (matchingOldVariant) {
        // If a matching old variant is found, merge the old data with the new one
        return { ...newVariant, ...matchingOldVariant };
      } else {
        // If no matching old variant is found, return the new variant as is
        return newVariant;
      }
    });
  };

  const handleRemoveAttribute = (fieldIndex) => {
    setAttributes(prevAttributes => {
      const newAttributes = [...prevAttributes];
      newAttributes.splice(fieldIndex, 1);
      return newAttributes;
    });

    console.log(attributes, 'attributes-HandleremoveAttribute')
  };

  const handleRemoveAttributeValue = (fieldIndex, valueIndex) => {
    // const newAttributes = prevAttributes.map((attribute, index) => {
    //   if (index === fieldIndex) {
    //     // Xóa phần tử cụ thể từ mảng values
    //     const updatedValues = attribute.values.filter((_, idx) => idx !== valueIndex);
    //     return { ...attribute, values: updatedValues };
    //   }
    //   return attribute;
    // });

    console.log(attributes, 'attributes-HandleremoveAttributeValue')
    // console.log(newAttributes, 'newAttributes-HandleremoveAttributeValue')

    // Cập nhật variants
    const newVariants = createVariants(attributes); // Tạo lại variants từ attributes mới
    const mergedVariants = mergeVariants(variants, newVariants); // Merge dữ liệu cũ và mới
    setVariants(mergedVariants);
  };

  useEffect(() => {
    fetchCategoryes();
    // form.setFieldsValue({ fields: [{ name: "", price: "", stock: "", discount: "", image: "" }] });
  }, []);

  // Cập nhật variants và columns khi attributes thay đổi
  useEffect(() => {
    console.log(attributes, 'attributes-useeffect')
    console.log(variants, 'variant-useeffect-event')
    if (attributes[1]) console.log('có attributes[1]')
    if (attributes[1] && (!attributes[1].name || attributes[1].values.length === 0)) {
      console.log('return')
      return;
    }
    const newVariants = createVariants(attributes);
    console.log(newVariants, 'newVariants-useeffect')
    const mergedVariants = mergeVariants(variants, newVariants);
    console.log(mergedVariants, 'mergedVariants-useeffect')
    setVariants(mergedVariants);
    form.setFieldsValue({ variants: mergedVariants });
    // form.setFieldsValue({ variants: newVariants });
    console.log(variants, 'after-useeffect')
    const newColumns = createColumns(attributes);
    setColumns(newColumns);
  }, [attributes]);


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

  // Step 1: Set up state for input values
  const [inputValues, setInputValues] = useState({
    originalPrice: '',
    currentPrice: '',
    stock: '',
  });

  // Step 2: Handle input changes
  const handleInputApplyAllChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  // Step 3: Apply values to all variants
  const applyToAllVariants = () => {
    const newVariants = variants.map(variant => ({
      ...variant,
      originalPrice: inputValues.originalPrice,
      currentPrice: inputValues.currentPrice,
      stock: inputValues.stock,
    }));
    form.setFieldsValue({ variants: newVariants });

    setVariants(newVariants);
  };
  return (
    <div className="w-full mx-auto px-5 pb-20">
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

          {/* {showPriceAndStock && (
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
          )} */}

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
                        {fields.length > 1 && (
                          <Button
                            className="dynamic-delete-button bg-red-800 text-white my-4"
                            onClick={() => {
                              // console.log(fields, 'fields')
                              // console.log(field.name, 'field.name')
                              remove(field.name);
                              console.log(field.name, 'field.name')
                              console.log(fieldIndex, 'fieldIndex')
                              handleRemoveAttribute(fieldIndex); // Hàm mới để xử lý xóa thuộc tính
                              console.log(variants, 'variants-deleteAttribute')
                              console.log(attributes, 'attribute-deleteAttribute')

                            }}
                            icon={<MinusCircleOutlined />}
                          >
                            Xóa phân loại hàng
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
                              <Button className="mt-2" type="dashed" onClick={() => {
                                console.log(variants, 'addValue')

                                addValue()
                              }
                              }
                                icon={<PlusOutlined />}>
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
                                      onChange={(e) => {
                                        console.log(valueField.name, 'valueField.name')
                                        handleInputAttributeValueChange(e.target.value, fieldIndex, valueIndex, "name")
                                      }}
                                    />
                                  </Form.Item>

                                  <div className="">
                                    {
                                      valueFields.length > 1 &&
                                      <Button
                                        className="dynamic-delete-button bg-red-500 text-white"
                                        onClick={() => {

                                          removeValue(valueField.name);
                                          handleInputAttributeValueChange("", fieldIndex, valueIndex, "name"); // Cập nhật attributes khi xóa
                                          handleRemoveAttributeValue(fieldIndex, valueIndex); // Hàm mới để xử lý xóa giá trị thuộc tính
                                          console.log(variants, 'deleteValue')
                                        }}
                                        icon={<MinusCircleOutlined />}
                                      >
                                        Xóa
                                      </Button>
                                    }
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
                    add();
                    // Using setAttributes to ensure the new attribute is added at the correct position (index 1)
                    setAttributes(prevAttributes => {
                      const newAttributes = [...prevAttributes];

                      // Insert the new attribute at index 1 if it doesn't exist already
                      if (newAttributes.length < 2) {
                        newAttributes.push({ name: '', values: [] });
                      } else {
                        // If an attribute at index 1 already exists, you might want to replace or ignore
                        // depending on your specific logic. Here we ensure that it exists.
                        newAttributes[1] = newAttributes[1] || { name: '', values: [] };
                      }

                      return newAttributes;
                    });

                    console.log(attributes, 'attribute-addAttributeEvent');
                    console.log(variants, 'variant-addAttributeEvent');
                  }} icon={<PlusOutlined />}>
                    Thêm phân loại hàng
                  </Button>
                </div>
              )}
            </Form.List>
          </div>


          {
            containsDefaultValues(attributes) ? null :
              <div>
                <div className="w-full flex gap-1 mb-2">
                  <input
                    className="flex-1 p-2 border-[1px] h-10"
                    type="number"
                    placeholder="Giá gốc"
                    value={inputValues.originalPrice}
                    onChange={(e) => setInputValues({ ...inputValues, originalPrice: e.target.value })}
                  />
                  <input
                    className="flex-1 p-2 border-[1px] h-10"
                    type="text"
                    placeholder="Giá khuyễn mãi"
                    value={inputValues.currentPrice}
                    onChange={(e) => setInputValues({ ...inputValues, currentPrice: e.target.value })}
                  />
                  <input
                    className="flex-1 p-2 border-[1px] h-10"
                    type="text"
                    placeholder="Kho hàng"
                    value={inputValues.stock}
                    onChange={(e) => setInputValues({ ...inputValues, stock: e.target.value })}
                  />
                  <button
                    type="button"
                    className="flex-1 p-2 w-12 h-10 bg-yellow-400 text-white"
                    onClick={applyToAllVariants}
                  >
                    Áp dụng cho tất cả phân loại
                  </button>
                </div>
                <Table
                  className="custom-table"
                  columns={createColumns(attributes)}
                  dataSource={variants}
                  pagination={false}
                  rowKey={(record, index) => index}
                />
              </div>
          }

          <Form.Item className="absolute bottom-0">
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