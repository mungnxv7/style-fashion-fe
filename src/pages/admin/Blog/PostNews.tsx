import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Form, Input, message, Upload, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FormPostNews } from "../../../types/blog";
import { hiddenSpinner, showSpinner } from "../../../util/util";
import { https } from "../../../config/axios";
import { localUserService } from "../../../services/localService";



const PostNews = () => {
  const [content, setContent] = useState<string>("");
  const [image, setPoster] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();


  const handleUpload: UploadProps["customRequest"] = ({ file }: any) => {
    setFile(file);
  };

  const onFinish = async (values: FormPostNews) => {
    
    showSpinner();
    try {
      let imageUrl = image;
      
      if (file) {
        const formData = new FormData();
        formData.append("images", file);

        const response = await https.post("/images", formData);
        if (response.data && response.data.data && response.data.data[0] && response.data.data[0].url) {
          imageUrl = response.data.data[0].url;
        } else {
          throw new Error("Phản hồi không chứa URL của ảnh!");
        }
      }

      const storedUserInfo = localUserService.get();
      const userId = storedUserInfo ? storedUserInfo.id : '';
      const data = {
        title: values.title,
        content: content,
        user: userId,
        image: imageUrl,
      };
     
      const res = await https.post("/blogs", data);
      if (res) {
        message.success("Đăng bài thành công!");
        navigate("/admin/blog");
      }
    } catch (error) {
      console.log("Lỗi khi đăng bài:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      hiddenSpinner();
    }
  };
  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Đăng Tin Tức</h1>
        <Form
          layout="vertical"
          name="basic"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <div className="mb-4">
            <Form.Item
              label="Tiêu đề:"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="image mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Poster:
            </label>
            <Upload customRequest={handleUpload} showUploadList={true}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>

          <div className="mb-4">
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
            >
              <Editor
                apiKey="2ag9f5652gfh8wi0m8g4ll6hb65iw6ldqyujk4ytt2ubto8n"
                value={content}
                init={{
                  height: 500,
                  menubar: true,
                  // style_formats:,
                  menu: {
                    file: { title: 'File', items: 'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations' },
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                    view: { title: 'View', items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                    insert: { title: 'Insert', items: 'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                    tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                    table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    help: { title: 'Help', items: 'help' }
                  },
                  plugins: [
                    "advlist",
                    "autolink",
                    "link",
                    "image",
                    "lists",
                    "charmap",
                    "preview",
                    "anchor",
                    "pagebreak",
                    "searchreplace",
                    "wordcount",
                    "visualblocks",
                    "visualchars",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "emoticons",
                    "help",
                  ],

                  toolbar:
                    "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
                  content_style: `
              /* To style the main scrollbar */
                  body::-webkit-scrollbar {
                    width: 12px;
                      }

              /* Track */
              body::-webkit-scrollbar-track {
                background: #f1f1f1;
              }

              /* Handle */
              body::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
              }

              /* Handle on hover */
              body::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `,
                }}
                onEditorChange={(content) => setContent(content)}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="text-white bg-green-500"
            >
              Đăng bài
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PostNews;
