import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      return toast.error('请填写所有字段');
    }
    if (form.password.length < 6) {
      return toast.error('密码至少6个字符');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('两次密码不一致');
    }
    setLoading(true);
    try {
      const res = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(res.data.data.token, res.data.data.user);
      toast.success('注册成功！');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <h1>创建账户</h1>
        <p className="subtitle">加入 CampusBookShare，开始分享电子书</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="你的昵称"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="至少6个字符"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>确认密码</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="再次输入密码"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '注 册'}
          </button>
        </form>

        <div className="form-footer">
          已有账户？ <Link to="/login">去登录</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
