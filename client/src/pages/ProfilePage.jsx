import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBooks } from '../api/books';
import { getFavorites } from '../api/favorites';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import { FiBook, FiHeart } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('uploads');
  const [myBooks, setMyBooks] = useState([]);
  const [favBooks, setFavBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, favsRes] = await Promise.all([
        getBooks({ limit: 100 }),
        getFavorites(),
      ]);
      // 筛选当前用户上传的书
      const allBooks = booksRes.data.data;
      setMyBooks(allBooks.filter((b) => b.uploader?._id === user._id));
      // 收藏的书
      setFavBooks(favsRes.data.data.map((f) => f.book).filter(Boolean));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'uploads' ? myBooks : favBooks;

  return (
    <>
      <Navbar />
      <div className="profile-page container fade-in">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.username[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
              上传 {myBooks.length} 本书 · 收藏 {favBooks.length} 本书
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'uploads' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploads')}
          >
            <FiBook style={{ marginRight: '6px' }} /> 我的上传
          </button>
          <button
            className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <FiHeart style={{ marginRight: '6px' }} /> 我的收藏
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : currentList.length > 0 ? (
          <div className="book-grid">
            {currentList.map((book, i) => (
              <div key={book._id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">{activeTab === 'uploads' ? '📤' : '💖'}</div>
            <p>
              {activeTab === 'uploads'
                ? '你还没有上传过电子书'
                : '你还没有收藏电子书'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
