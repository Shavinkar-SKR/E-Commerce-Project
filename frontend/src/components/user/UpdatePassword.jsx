export default function UpdatePassword() {
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg">
          <h1 className="mt-2 mb-5">Update Password</h1>
          <div className="form-group">
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value=""
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password_field">New Password</label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value=""
            />
          </div>

          <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
