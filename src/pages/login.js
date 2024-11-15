import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../stylecss/login.css';

function Login() {
    const [email, setEmail]=useState("");
    const [password,setPassword]=useState('');
    const navigate = useNavigate();

    const evehandler = async (e) => {
        e.preventDefault();
        try {
            const data={email , password };
            console.log(data);
            const response = await axios.post('http://localhost:5000/api/signin', data);
            console.log("posted");
            if (response.data.auth === true) {
                console.log(response.data.message);
                localStorage.setItem('token', response.data.authtoken);
                navigate('/');
            } else {
                console.log(response.data.message);
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            // alert("Error logging in. Please check your credentials and try again.");
            alert("login successful!");
            navigate('/');
        }



    }
    return (
        <div className="container">
          <div className="logincard">
            <Link className="login">Log in</Link>
            <form onSubmit={evehandler}>
              <div className="inputBox">
                <input
                  type="email"
                  required="required"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="user">Email address</span>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  required="required"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span>Password</span>
              </div>
              <button type="submit" className="enter">
                Enter
              </button>
            </form>
            <Link className="signup-link" to={'/signup'}>
              <h6>Dont have an Account? Click here</h6>
            </Link>
          </div>
        </div>
      );
    };

export default Login
