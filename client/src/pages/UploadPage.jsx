import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiImage, FiFile } from 'react-icons/fi';
import { createBook } from '../api/books';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const navigate = useNavigate();
  const bookFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '其他',
  });
  const [bookFile, setBookFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      return toast.error('请填写书名和作者');
    }
    if (!bookFile) {
      return toast.error('请选择电子书文件');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('author', form.author);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('bookFile', bookFile);
      if (coverFile) {
        formData.append('coverFile', coverFile);
      }

      const res = await createBook(formData);
      toast.success('上传成功！');
      navigate(`/books/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || '上传失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-page container">
        <div className="page-header">
          <h1>上传电子书</h1>
          <p>分享你的电子书，与更多同学一起学习</p>
        </div>

        <form className="upload-form fade-in-up" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>书名 *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="输入书名"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>作者 *</label>
            <input
              type="text"
              name="author"
              className="form-control"
              placeholder="输入作者名"
              value={form.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>分类</label>
            <select
              name="category"
              className="form-control"
              value={form.category}
              onChange={handleChange}
            >
              <option value="文学">文学</option>
              <option value="理工">理工</option>
              <option value="经管">经管</option>
              <option value="外语">外语</option>
              <option value="考试">考试</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="简单描述一下这本书..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Book File Upload */}
          <div className="form-group">
            <label>电子书文件 *</label>
            <div
              className="file-upload-area"
              onClick={() => bookFileRef.current.click()}
            >
              <FiUploadCloud className="upload-icon" />
              <p>点击上传电子书文件</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                支持 PDF, EPUB, MOBI, TXT, DOC（最大 50MB）
              </p>
              {bookFile && (
                <p className="file-name"><FiFile /> {bookFile.name}</p>
              )}
              <input
                ref={bookFileRef}
                type="file"
                accept=".pdf,.epub,.mobi,.txt,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => setBookFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Cover Upload */}
          <div className="form-group">
            <label>封面图片（可选）</label>
            <div
              className="file-upload-area"
              onClick={() => coverFileRef.current.click()}
              style={{ padding: '24px' }}
            >
              <FiImage className="upload-icon" style={{ fontSize: '28px' }} />
              <p>点击上传封面图片</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                支持 JPG, PNG, GIF, WEBP（最大 5MB）
              </p>
              {coverFile && (
                <p className="file-name"><FiImage /> {coverFile.name}</p>
              )}
              <input
                ref={coverFileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                style={{ display: 'none' }}
                onChange={(e) => setCoverFile(e.target.files[0])}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '📤 上传电子书'}
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadPage;
