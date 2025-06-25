import styles from "./Filters.module.css";

const categories = [
  "",
  "food",
  "transport",
  "shopping",
  "entertainment",
  "bills",
  "salary",
  "investment",
  "other",
];

const Filters = ({ filters, onFilterChange, showCategoryFilter = true }) => {
  const handleInputChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    // Convert date string to a Date object or keep it as a string
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleDateChange}
        />
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleDateChange}
        />
      </div>
      {showCategoryFilter && (
        <div className={styles.filterGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category || ""}
            onChange={handleInputChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat
                  ? cat.charAt(0).toUpperCase() + cat.slice(1)
                  : "All Categories"}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Filters;
