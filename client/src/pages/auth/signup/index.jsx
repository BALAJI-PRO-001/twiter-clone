import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { 
  validateUsername,
  validateFullName,
  validateEmail,
  validatePassword
} from '../../../utils/validator';


const Signup = () => {
  const isError = true;
  const [errMessage, setErrMessage] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleInputValidation =  async (e) => {
    e.preventDefault();
    
    if (e.target.id === 'username') {
      const { isValid, message } = await validateUsername(e.target.value);
      if (!isValid) {
        return setErrMessage(message);
      } else {
        return setErrMessage('');
      }
    }

    if (e.target.id === 'fullName') {
      const { isValid, message } = await validateFullName(e.target.value);
      if (!isValid) {
        return setErrMessage(message);
      } else {
        return setErrMessage('');
      }
    }

    if (e.target.id === 'email') {
      const { isValid, message } = await validateEmail(e.target.value);
      if (!isValid) {
        return setErrMessage(message);
      } else {
        return setErrMessage('');
      }
    }

    if (e.target.id === 'password') {
      const { isValid, message } = await validatePassword('Password', e.target.value);
      if (!isValid) {
        return setErrMessage(message);
      } else {
        return setErrMessage('');
      }
    }
  }


  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join Today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2 mt-2">
            <FaUser />
            <input
              id="username"
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              onKeyUp={handleInputValidation}
              value={formData.username}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                id="fullName"
                type="text"
                className="grow "
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                onKeyUp={handleInputValidation}
                value={formData.fullName}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdOutlineMail />
              <input
                id="email"
                type="text"
                className="grow"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                onKeyUp={handleInputValidation}
                value={formData.email}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              id="password"
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              onKeyUp={handleInputValidation}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            Sign up
          </button>
          {isError && <p className="text-red-500">{errMessage}</p>}
        </form>
        <div className="flex flex-wrap gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <span className="text-primary text-lg font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
