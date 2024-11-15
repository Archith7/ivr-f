// import React, { useState } from 'react';
// import "../stylecss/signup.css";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Signup() {
//     const [name, setName]=useState('')
//     const [email, setEmail]=useState('')
//     const [password,setPassword]=useState('')
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate= useNavigate();
//     // const handleSubmit=async(e)=>{
//     //     e.preventDefault()
//     //     await axios.post('http://localhost:5000/api/signup',{name, email, password});
//     //     // .then(result => console.log(result))
//     //     // .catch(err=>console.log(err))
//     // }
//     const handleSubmit = (e) => {
//         e.preventDefault();
    
//         const data = { name, email, password, isAdmin };
//         console.log('Sending data:', data); 
    
//         axios.post('http://localhost:5000/api/signup', data)

//           .then((result) => {
//             console.log('Result:', result);
//             localStorage.setItem('token',result.data.authtoken);
//             console.log('token',result.data.authtoken);
//             alert("done dude");
//             navigate('/home');
//           })
        
//           .catch((err) => {
//             console.error('Error:', err.response ? err.response.data : err.message);
          
//     });
//     };

//     // const alertss=()=>{
//     //     alert("Enter Admin id")
//     // }
//     return (
//         <div>
//             <h3>Sign Up page</h3>

//             <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//                     <label for="exampleInputName" className="form-label">Name</label>
//                     <input type="name" className="form-control" id="exampleInputName1" aria-describedby="emailHelp" onChange={(e)=>setName(e.target.value)}/>
//                         {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
//                 </div>
//                 <div className="mb-3">
//                     <label for="exampleInputEmail1" className="form-label">Email address</label>
//                     <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=>setEmail(e.target.value)}/>
//                         {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
//                 </div>
//                 <div className="mb-3">
//                     <label for="exampleInputPassword1" className="form-label">Password</label>
//                     <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e)=> setPassword(e.target.value)}/>
//                 </div>
//                 <div className="mb-3 form-check">
//                     <div className='xyz'>
                    
//                     <input type="checkbox" className="form-check-input" id="exampleCheck1" onChange={(e) => setIsAdmin(e.target.checked)} />
//                         <label className="form-check-label" for="exampleCheck1" >Sign Up As Admin</label>
//                         </div>
//                 </div>
//                 <button type="submit" className="btn btn-primary">Submit</button>
//             </form>
//         </div>
//     )
// }

// export default Signup


// import React, { useState } from 'react';
// import "../stylecss/signup.css";
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// function Signup() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const data = { name, email, password, isAdmin };
//         console.log('Sending data:', data);

//         axios.post('http://localhost:5000/api/signup', data)
//             .then((result) => {
//                 console.log('Result:', result);
//                 localStorage.setItem('token', result.data.authtoken);
//                 console.log('token', result.data.authtoken);
//                 alert("Registration successful");
//                 navigate('/');
//             })
//             .catch((err) => {
//                 console.error('Error:', err.response ? err.response.data : err.message);
//             });
//     };

//     return (
//         <div className="container">
//             <div className="signupcard">
//                 <Link className="signup">Sign Up</Link>
//                 <form onSubmit={handleSubmit}>
//                     <div className="inputBox">
//                         <input
//                             type="text"
//                             required="required"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                         />
//                         <span className="user">Name</span>
//                     </div>
//                     <div className="inputBox">
//                         <input
//                             type="email"
//                             required="required"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                         <span>Email</span>
//                     </div>
//                     <div className="inputBox">
//                         <input
//                             type="password"
//                             required="required"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <span>Password</span>
//                     </div>
//                     <div className="inputBox checkboxContainer">
//                         <input
//                             type="radio"
//                             id="adminCheck"
//                             onChange={(e) => setIsAdmin(e.target.checked)}
//                             className="admin-radio"
//                         />
//                         <label htmlFor="adminCheck" className="checkboxLabel">Sign Up As Admin</label>
//                     </div>
//                     <button type="submit" className="enter">Enter</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Signup;
import React, { useState } from 'react';
import "../stylecss/signup.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, email, password, isAdmin };

        if (isAdmin) {
            const adminKey = prompt("Enter the secret admin key:");
            if (adminKey !== 'admin123') {
                alert('The admin key is incorrect. You cannot sign up as an admin.');
                return;
            }
        }

        console.log('Sending data:', data);

        axios.post('http://localhost:5000/api/signup', data)
            .then((result) => {
                console.log('Result:', result);
                localStorage.setItem('token', result.data.authtoken);
                console.log('token', result.data.authtoken);
                alert("Registration successful");
                navigate('/');
            })
            .catch((err) => {
                console.error('Error:', err.response ? err.response.data : err.message);
            });
    };

    return (
        <div className="container">
            <div className="signupcard">
                <Link className="signup">Sign Up</Link>
                <form onSubmit={handleSubmit}>
                    <div className="inputBox">
                        <input
                            type="text"
                            required="required"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <span className="user">Name</span>
                    </div>
                    <div className="inputBox">
                        <input
                            type="email"
                            required="required"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <span>Email</span>
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
                    <div className="inputBox checkboxContainer">
                        <input
                            type="checkbox"
                            id="adminCheck"
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="admin-radio"
                        />
                        <label htmlFor="adminCheck" className="checkboxLabel">Sign Up As Admin</label>
                    </div>
                    <button type="submit" className="enter">Enter</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
