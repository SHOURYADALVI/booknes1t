import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { BOOKS } from "../data/mockData";
import BookCard from "../components/BookCard";
import "./ShopPage.css";

const GENRES = ["All", ...new Set(BOOKS.map(b => b.genre))];
const SORTS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("default");
  const [formatFilter, setFormatFilter] = useState("All");

  const formats = ["All", "Print", "eBook", "Audiobook"];

  const filtered = useMemo(() => {
    let books = [...BOOKS];
    if (search) books = books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );
    if (genre !== "All") books = books.filter(b => b.genre === genre);
    if (formatFilter !== "All") books = books.filter(b => b.format.includes(formatFilter));
    if (sort === "price-asc") books.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") books.sort((a, b) => b.price - a.price);
    else if (sort === "rating") books.sort((a, b) => b.rating - a.rating);
    return books;
  }, [search, genre, sort, formatFilter]);

  return (
    <div className="shop-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Our Collection</h1>
            <p className="page-subtitle">{BOOKS.length} handpicked titles — {filtered.length} matching your filters</p>
          </div>
        </div>

        {/* Filters */}
        <div className="shop-filters">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              className="form-input search-input"
              placeholder="Search by title or author…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-chips-wrap">
            <SlidersHorizontal size={14} className="filter-label-icon" />
            {GENRES.map(g => (
              <button
                key={g}
                className={`filter-chip ${genre === g ? "active" : ""}`}
                onClick={() => setGenre(g)}
              >{g}</button>
            ))}
          </div>

          <div className="filter-row-2">
            <div className="format-chips">
              {formats.map(f => (
                <button
                  key={f}
                  className={`filter-chip filter-chip-sm ${formatFilter === f ? "active" : ""}`}
                  onClick={() => setFormatFilter(f)}
                >{f}</button>
              ))}
            </div>
            <select className="form-input sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No books found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="books-grid">
            {filtered.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  );
}
