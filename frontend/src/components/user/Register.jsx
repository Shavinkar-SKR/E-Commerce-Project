import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/authAction";
import { toast } from "react-toastify";
import { clearAuthError } from "../../actions/authAction";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.authState);

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "images/default_avatar.png"
  );

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        //onload is an event handler that will run after the file has been successfully read by FileReader
        if (reader.readyState === 2) {
          //readyState tells, the progress of the file reading:
          //0 -> EMPTY (no file yet), 1 -> LOADING (reading in progress), 2 -> DONE (reading finished). Here, we only proceed if reading is complete.
          setAvatarPreview(reader.result); //reader.result contains the file’s contents.
          setAvatar(e.target.files[0]); //stores the original File object in state so it can be sent to the backend later in a FormData request.
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("avatar", avatar);

    dispatch(register(formData));
    navigate("/");
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [error]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          onSubmit={submitHandler}
          className="shadow-lg"
          encType="multipart/form-data"
        >
          <h1 className="mb-3">Register</h1>

          <div className="form-group">
            <label htmlFor="email_field">Name</label>
            <input
              name="name"
              onChange={onChange}
              type="name"
              id="name_field"
              className="form-control"
              value={userData.name}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              name="email"
              onChange={onChange}
              type="email"
              id="email_field"
              className="form-control"
              value={userData.email}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              name="password"
              onChange={onChange}
              type="password"
              id="password_field"
              className="form-control"
              value={userData.password}
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar_upload">Avatar</label>
            <div className="d-flex align-items-center">
              <div>
                <figure className="avatar mr-3 item-rtl">
                  <img
                    src={avatarPreview}
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  name="avatar"
                  onChange={onChange}
                  className="custom-file-input"
                  id="customFile"
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Avatar
                </label>
              </div>
            </div>
          </div>

          <button
            id="register_button"
            type="submit"
            className="btn btn-block py-3"
            disabled={loading}
          >
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}
