import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiHeart, FiCalendar, FiHardDrive, FiUser, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { getBook, downloadBook } from '../api/books';
import { getComments, createComment, deleteComment } from '../api/comments';
import { checkFavorite, addFavorite, removeFavorite } from '../api/favorites';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const BookDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Comment form
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBook();
    fetchComments();
    if (user) checkFav();
  }, [id, user]);

  const fetchBook = async () => {
    try {
      const res = await getBook(id);
      setBook(res.data.data);
    } catch {
      toast.error('书籍不存在');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(id);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkFav = async () => {
    try {
      const res = await checkFavorite(id);
      setIsFavorited(res.data.data.isFavorited);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    if (!user) return toast.error('请先登录');
    setDownloading(true);
    try {
      const res = await downloadBook(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', book.fileName || 'book');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setBook((prev) => ({ ...prev, downloadCount: prev.downloadCount + 1 }));
      toast.success('开始下载');
    } catch {
      toast.error('下载失败');
    } finally {
      setDownloading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error('请先登录');
    try {
      if (isFavorited) {
        await removeFavorite(id);
        setIsFavorited(false);
        toast.success('已取消收藏');
      } else {
        await addFavorite(id);
        setIsFavorited(true);
        toast.success('已收藏');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || '操作失败');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return toast.error('请输入评论内容');
    setSubmitting(true);
    try {
      await createComment({ book: id, content: commentContent, rating: commentRating });
      toast.success('评论成功');
      setCommentContent('');
      setCommentRating(5);
      fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || '评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定删除这条评论吗？')) return;
    try {
      await deleteComment(commentId);
      toast.success('评论已删除');
      fetchComments();
    } catch {
      toast.error('删除失败');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '未知';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const avgRating = comments.length
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container" style={{ paddingTop: '120px' }}>
          <div className="spinner" />
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Navbar />
        <div className="empty-state" style={{ paddingTop: '120px' }}>
          <div className="icon">😢</div>
          <p>书籍不存在</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="book-detail container fade-in">
        <div className="book-detail-grid">
          {/* Cover */}
          <div className="book-cover-large">
            {book.cover ? (
              <img src={book.cover} alt={book.title} />
            ) : (
              <div className="placeholder"><FiBookOpen /></div>
            )}
          </div>

          {/* Info */}
          <div className="book-info">
            <h1>{book.title}</h1>
            <p className="author">作者：{book.author}</p>
            <span className="category-badge">{book.category}</span>

            {comments.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <StarRating rating={Math.round(avgRating)} />
                <span style={{ color: 'var(--amber-500)', fontWeight: 700 }}>{avgRating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({comments.length} 条评论)</span>
              </div>
            )}

            {book.description && (
              <p className="description">{book.description}</p>
            )}

            <div className="book-meta-row">
              <div className="book-meta-item">
                <FiUser className="icon" />
                <span>{book.uploader?.username || '匿名'}</span>
              </div>
              <div className="book-meta-item">
                <FiCalendar className="icon" />
                <span>{formatDate(book.createdAt)}</span>
              </div>
              <div className="book-meta-item">
                <FiHardDrive className="icon" />
                <span>{formatSize(book.fileSize)}</span>
              </div>
              <div className="book-meta-item">
                <FiDownload className="icon" />
                <span>{book.downloadCount} 次下载</span>
              </div>
            </div>

            <div className="book-actions">
              <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
                <FiDownload /> {downloading ? '下载中...' : '下载电子书'}
              </button>
              <button
                className={`btn ${isFavorited ? 'btn-danger' : 'btn-secondary'}`}
                onClick={handleFavorite}
              >
                <FiHeart /> {isFavorited ? '取消收藏' : '收藏'}
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2>📝 评论 ({comments.length})</h2>

          {user && (
            <form className="comment-form" onSubmit={handleComment}>
              <h3>写评论</h3>
              <div className="form-group">
                <label>评分</label>
                <StarRating rating={commentRating} onRate={setCommentRating} size={24} />
              </div>
              <div className="form-group">
                <label>评论内容</label>
                <textarea
                  className="form-control"
                  placeholder="分享你的阅读感受..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  maxLength={500}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '提交中...' : '提交评论'}
              </button>
            </form>
          )}

          <div className="comment-list">
            {comments.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px' }}>
                <p>暂无评论，来发表第一条吧！</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment-item fade-in-up">
                  <div className="comment-header">
                    <div className="comment-user">
                      <div className="avatar">
                        {comment.user?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="info">
                        <div className="name">{comment.user?.username || '匿名'}</div>
                        <div className="date">{formatDate(comment.createdAt)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StarRating rating={comment.rating} size={14} />
                      {user && (user._id === comment.user?._id || user.role === 'admin') && (
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => handleDeleteComment(comment._id)}
                          title="删除评论"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetailPage;
