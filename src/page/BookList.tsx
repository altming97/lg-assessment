import { ChangeEvent, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { Book, BookCategory } from "src/common/interface/Book";
import { readableDate, getQueryParams } from "src/common/utils";

import { Button, Loader } from "src/components";

function App() {
  const [initialLoading, setInitialLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string>("");
  const [bookList, setBookList] = useState<Book[]>([]);
  const [totalBookList, setTotalBookList] = useState<Number>(0);
  const [filter, setFilter] = useState<string>("");
  const [filterList, setFilterList] = useState<string[]>([]);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false);
  const categoryFilter = useRef<HTMLSelectElement>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const getBookList = (
    count: number,
    append: boolean,
    filter?: string,
    take?: number,
  ) => {
    const obj = {
      count: count.toString(),
      ...(take && { take: take.toString() }),
      ...(filter && { filter }),
    };
    let params = new URLSearchParams(obj).toString();
    let url = `http://localhost:3000/api/posts?${params}`;

    fetch(url)
      .then((res) => res.json())
      .then((res: { data: Book[]; total: number }) => {
        setInitialLoading(false);
        setLoadMoreBtn(res.total - count > 0);
        setTotalBookList(res.total);
        if (append) {
          setBookList(bookList.concat(res.data));
        } else {
          setBookList(res.data);
        }

        // Auto scroll
        scrollTo(!append);

        // Persist state in query string
        delete obj.take;
        navigate("?" + new URLSearchParams(obj).toString());
      })
      .catch((err) => {
        console.log(err);
        setError(
          "Something went wrong, or the source you are finding doesn't exists",
        );
      });
  };

  const getCategoryFilter = () => {
    fetch("http://localhost:3000/api/category")
      .then((res) => res.json())
      .then((data: string[]) => {
        const { filter } = getQueryParams();
        if (data.includes(filter)) {
          setFilter(filter);
        }
        setFilterList(data);
      });
  };

  const changeFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    getBookList(10, false, e.target.value);
  };

  const loadMore = () => {
    getBookList(bookList.length + 10, true, categoryFilter.current?.value, 10);
  };

  const scrollTo = (toTop: boolean) => {
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: toTop ? 0 : tableRef.current?.scrollTop + 250,
        behavior: "smooth",
      });
    }, 0);
  };

  const toBookDetail = (id: string, book: Book) => {
    // Pass data directly to detail page as state
    navigate(`/detail?id=${id}`, { state: { book } });
  };

  useEffect(() => {
    let isFetched = false;
    const fetchData = () => {
      if (!isFetched) {
        if (window.location.search) {
          const { count, filter } = getQueryParams();
          getBookList(count ? parseInt(count) : 10, false, filter);
        } else {
          getBookList(10, false);
        }
        getCategoryFilter();
      }
    };

    fetchData();

    return () => {
      isFetched = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initialLoading || error) {
    return <Loader label={error ? error : "Loading..."} />;
  }

  return (
    <div className="container">
      <div className="table-header">
        <div className="title">Browse Books</div>
        <div className="fn">
          {filterList && filterList.length > 0 ? (
            <div className="filter">
              <span>Category: </span>
              <select
                onChange={changeFilter}
                ref={categoryFilter}
                value={filter}
              >
                <option value="">All</option>
                {filterList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <span className="show">{`Showing ${bookList.length} of ${totalBookList}`}</span>
        </div>
      </div>
      <div className="table-responsive" ref={tableRef}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Author</th>
              <th>Title</th>
              <th>Summary</th>
              <th>Category</th>
              <th>Publish Date</th>
            </tr>
          </thead>
          <tbody>
            {bookList.length ? (
              <TransitionGroup component={null}>
                {bookList.map((datum: Book, index) => (
                  <CSSTransition
                    key={datum.id}
                    timeout={500}
                    classNames="fade"
                    appear
                  >
                    <tr
                      key={datum.id}
                      onClick={() => toBookDetail(datum.id, datum)}
                    >
                      <td>{index + 1}</td>
                      <td data-th="Author">
                        <div className="author">
                          <img
                            className="avatar"
                            src={datum.author.avatar}
                            alt={datum.author.name}
                          />
                          <div>{datum.author.name}</div>
                        </div>
                      </td>
                      <td data-th="Title" className="title">
                        {datum.title}
                      </td>
                      <td data-th="Summary" className="summary">
                        {datum.summary}
                      </td>
                      <td data-th="Category">
                        <div>
                          {datum.categories.map((cat: BookCategory) => (
                            <div className="category" key={cat.id}>
                              <div>-</div>
                              <div
                                className={
                                  filter === cat.name ? "highlight" : ""
                                }
                              >
                                {cat.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td data-th="Publish Date">
                        {readableDate(datum.publishDate)}
                      </td>
                    </tr>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="no-data">No Data</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-center" style={{ margin: "10px 0px" }}>
          {loadMoreBtn ? (
            <Button label="Load More" pill onClick={loadMore} />
          ) : (
            <div style={{ fontWeight: "bold" }}>- End of list -</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
