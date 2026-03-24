import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating = 0, onRate = null, size = 20 }) => {
  const isReadonly = !onRate;

  return (
    <div className={`star-rating ${isReadonly ? 'readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          style={{ fontSize: `${size}px` }}
          onClick={() => onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
