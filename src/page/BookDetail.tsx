import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { Book } from "src/common/interface/Book";
import { readableDate, getQueryParams } from "src/common/utils";

import { Pill, Loader } from "src/components";

const BookDetail = () => {
  const location = useLocation();
  const [data, setData] = useState<Book>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(
    !(location.state && location.state.book), // Avoid "Loading..." flicker
  );

  useEffect(() => {
    // Get from location state
    if (location.state && location.state.book) {
      setData(location.state.book);
    } else {
      // Handle direct URL access
      const { id } = getQueryParams();
      if (id) {
        fetch(`http://localhost:3000/api/posts/${id}`)
          .then((res) => res.json())
          .then((res: Book | null) => {
            setLoading(false);
            if (res) {
              setData(res);
            } else {
              throw Error;
            }
          })
          .catch((err) => {
            console.log(err);
            setError(
              "Something went wrong, or the source you are finding doesn't exists",
            );
          });
      }
    }
  }, [location.state]);

  if (loading || error) {
    return <Loader label={error ? error : "Loading..."} />;
  }

  return (
    <TransitionGroup component={null}>
      <CSSTransition timeout={500} classNames="fade" appear>
        <div className="book-detail-container">
          <div className="panel">
            <div className="book-image"></div>
            <div className="book-detail">
              <div className="title">{data?.title}</div>
              <div className="author">
                <div>
                  <img
                    className="avatar"
                    src={data?.author.avatar}
                    alt={data?.author.name}
                  />
                </div>
                <div className="name">{data?.author.name}</div>
                <div className="rating">10</div>
              </div>
              <div>{data?.summary}</div>
              <div className="info">
                <table>
                  <tbody>
                    <tr>
                      <td>Publisher</td>
                      <td>Global Inc</td>
                    </tr>
                    <tr>
                      <td>Publish Date</td>
                      <td>{readableDate(data?.publishDate || "")}</td>
                    </tr>
                    <tr>
                      <td>ISBN</td>
                      <td>028996461, 631999875214</td>
                    </tr>
                    <tr>
                      <td>Language</td>
                      <td>English</td>
                    </tr>
                    <tr>
                      <td>Pages</td>
                      <td>240p</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="category">
                <div className="lead">Category</div>
                <div className="tag-container">
                  {data?.categories.map((c) => (
                    <Pill
                      key={c.id}
                      label={c.name}
                      style={{ backgroundColor: "dodgerblue" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default BookDetail;
