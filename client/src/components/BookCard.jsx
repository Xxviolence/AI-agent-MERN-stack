import { useNavigate } from 'react-router-dom';
import { FiDownload, FiBookOpen } from 'react-icons/fi';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="book-card" onClick={() => navigate(`/books/${book._id}`)}>
      <div className="book-card-cover">
        {book.cover ? (
          <img src={book.cover} alt={book.title} />
        ) : (
          <div className="placeholder">
            <FiBookOpen />
          </div>
        )}
        <span className="book-card-category">{book.category}</span>
      </div>
      <div className="book-card-body">
        <h3 title={book.title}>{book.title}</h3>
        <p className="author">{book.author}</p>
        <div className="book-card-meta">
          <span><FiDownload /> {book.downloadCount || 0}</span>
          {book.fileSize > 0 && <span>{formatSize(book.fileSize)}</span>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
