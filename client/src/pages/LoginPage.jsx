import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error('请填写所有字段');
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.data.token, res.data.data.user);
      toast.success('登录成功！');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <h1>欢迎回来</h1>
        <p className="subtitle">登录你的 CampusBookShare 账户</p>

        <form onSubmit={handleSubmit}>
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
              placeholder="输入密码"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '登 录'}
          </button>
        </form>

        <div className="form-footer">
          还没有账户？ <Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
