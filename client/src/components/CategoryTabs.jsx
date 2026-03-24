const CategoryTabs = ({ active, onChange }) => {
  const categories = ['全部', '文学', '理工', '经管', '外语', '考试', '其他'];

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-tab ${active === cat ? 'active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
