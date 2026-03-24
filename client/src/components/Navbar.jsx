import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUpload, FiUser, FiLogOut, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">📚</span>
          CampusBookShare
        </Link>

        <div className="navbar-center">
          <form className="navbar-search" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="搜索书名、作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/upload" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                <FiUpload /> 上传
              </Link>
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <div className="navbar-user" onClick={() => setShowDropdown(!showDropdown)}>
                  <div className="avatar">{user.username[0].toUpperCase()}</div>
                  <span className="name">{user.username}</span>
                </div>
                {showDropdown && (
                  <div className="user-dropdown">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                      <FiUser /> 个人中心
                    </Link>
                    <button onClick={handleLogout}>
                      <FiLogOut /> 退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">登录</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
