import React from "react";

export default function Header() {
  return (
    <>
      <nav classNameName="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <img width="150px" src="./images/logo.png" />
          </div>
        </div>

        <div classNameName="col-12 col-md-6 mt-2 mt-md-0">
          <div className="input-group">
            <input
              type="text"
              id="search_field"
              className="form-control"
              placeholder="Enter Product Name ..."
            />
            <div classNameName="input-group-append">
              <button id="search_btn" classNameName="btn">
                <i classNameName="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <button className="btn" id="login_btn">
            Login
          </button>

          <span id="cart" className="ml-3">
            Cart
          </span>
          <span className="ml-1" id="cart_count">
            2
          </span>
        </div>
      </nav>
    </>
  );
}
