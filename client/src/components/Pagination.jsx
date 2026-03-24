const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    return items;
  };

  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ‹
      </button>
      {getPages().map((p) => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        ›
      </button>
    </div>
  );
};

export default Pagination;
