import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { getBooks } from '../api/books';
import BookCard from '../components/BookCard';
import CategoryTabs from '../components/CategoryTabs';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [category, setCategory] = useState('全部');
  const [searchParams, setSearchParams] = useSearchParams();
  const [heroSearch, setHeroSearch] = useState(searchParams.get('search') || '');

  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchBooks();
  }, [searchParams, category]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
      };
      if (category !== '全部') params.category = category;
      if (search) params.search = search;

      const res = await getBooks(params);
      setBooks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchParams({ search: heroSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (newPage) => {
    const params = {};
    if (search) params.search = search;
    params.page = newPage;
    setSearchParams(params);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams({});
  };

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>📚 校园电子书共享平台</h1>
          <p>分享知识，传递智慧。上传你的电子书，与校园伙伴一起学习成长。</p>
          <form className="hero-search" onSubmit={handleHeroSearch}>
            <input
              type="text"
              placeholder="搜索书名、作者、关键词..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button type="submit"><FiSearch /></button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '16px', paddingBottom: '60px' }}>
        <CategoryTabs active={category} onChange={handleCategoryChange} />

        {search && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
            搜索 "<strong style={{ color: 'var(--primary-400)' }}>{search}</strong>" 的结果，共 {pagination.total} 条
          </p>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="book-grid">
              {books.map((book, i) => (
                <div key={book._id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">📖</div>
            <p>{search ? '没有找到匹配的书籍' : '暂无书籍，快去上传第一本吧！'}</p>
          </div>
        )}
      </main>
    </>
  );
};

export default HomePage;
