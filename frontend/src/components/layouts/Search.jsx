import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); //gives the information about the current URL the user is on. useLocation() is like "where am I right now"

  const searchHandler = (e) => {
    e.preventDefault(); //disables refreshing
    navigate(`/search/${keyword}`);
  };

  const clearSearch = () => {
    setKeyword("");
  };

  useEffect(() => {
    if (location.pathname === "/") {
      clearSearch();
    }
  }, [location]);

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
}
