import { useState } from "react";
import { User, Mail, LockKeyhole, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService";
import "./Register.css";
const Register = () => {
  const navigate = useNavigate();
  //use state used for value trackimg in component
  //1st variable -variable to show and store value
  //2nd variable -state updating function (use to update value of state)

  const [FormData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  //state to store errors
  const [error, setErrors] = useState({});

  //state to show loading state
  const [isLoadding, setIsLoading] = useState(false);

  const handleChange = (e) => {
    console.log("event.target.vale:", e.target.value, e.target.name);

    //setformData(new value)
    setFormData({
      ...FormData, //store old values
      [e.target.name]: e.target.value,
    });
  };

  console.log({ FormData });

  //function to validate form data(return true if valid,false otherwise)
  const validate = () => {
    const newErrors = {};

    if (!FormData.name.trim()) newErrors.name = "Full name is required";
    else if (FormData.name.length < 3)
      newErrors.name = "Minimum 3 character reqiured";

    if (!FormData.email.trim()) newErrors.email = "Email is Required";
    else if (!/^[^\s@]+@[^s@]+\.[^\s@]+$/.test(FormData.email))
      newErrors.email = "Invalid email format";

    if (!FormData.phone.trim()) newErrors.Phone = "Mobile Number is Required";
    else if (!/^[0-9]{10}$/.test(FormData.phone))
      newErrors.phone = "Enter !0 digit number";

    if (!FormData.password.trim()) newErrors.password = "Password is Required";
    else if (FormData.password.length < 6)
      newErrors.password = "Minimum 6 characters reqiured";

    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // to prevet page refresh behavior while form submit

    if (!validate()) return;
    //200,201,400,401,404,500********
    setIsLoading(true);
    try {
      console.log({ FormData });

      // ***API call to register user****
      const res = await ApiService.post("/users/add", {
        ...FormData, // copy all formData fields
        role: "user",
      });

      console.log({ res });
      // on successful registration
      if (res.code === 201) {
        localStorage.setItem("authDetail-tickethub", JSON.stringify(res.data));
        navigate("/user/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.description || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  //**************form-design start **************
  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="logo-wrapper">
          <img src="reg.png" alt="logo" height={"50px"} width={"70px"} />
        </div>
        <h1 className="register-title">Register</h1>
        <p className="register-subtitle">Create an account to continue</p>
        {/* form design */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/*name*/}
          <div className="form-group">
            <label>Full Name:</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                name="name"
                value={FormData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            {error.name && <p className="error-text">{error.name}</p>}
          </div>
          {/* email */}
          <div className="form-group">
            <label>Email:</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={FormData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            {error.email && <p className="error-text">{error.email}</p>}
          </div>
          {/* mobileno */}
          <div className="form-group">
            <label>Mobile Number:</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input
                type="tel"
                name="phone"
                value={FormData.phone}
                onChange={handleChange}
                placeholder="1234567890"
              />
            </div>
            {error.phone && <p className="error-text">{error.phone}</p>}
          </div>
          {/* password */}
          <div className="form-group">
            <label>Password:</label>
            <div className="input-wrapper">
              <LockKeyhole size={18} />
              <input
                type="password"
                name="password"
                value={FormData.password}
                onChange={handleChange}
                placeholder="password"
              />
            </div>
            {error.password && <p className="error-text">{error.password}</p>}
          </div>
          {/* button */}
          <button type="submit" className="submit-btn" disabled={isLoadding}>
            {isLoadding ? "Creating account..." : "sign up"}
          </button>
        </form>
        <p className="login-text">
          You already have an account?
          <button onClick={() => navigate("/Login")}>Sign in here</button>
        </p>
      </div>
    </div>
  );
};
export default Register;
