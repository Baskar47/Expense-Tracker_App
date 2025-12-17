import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"; 

function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const formData = { email, password };

        try{
            const response = await axios.post('http://localhost:5000/auth/login', formData);
            if(response.data.success){
                navigate('/Home');
            }else{
                alert(response.data.message);
            }
        }catch(err){
            alert('Login failed');
        }
    };

    return(
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="login-input"
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="login-input"
                />

                <button type="submit" className="login-btn">Login</button>

                <p className="login-footer">
                    Don't have an account? 
                    <span className="login-link" onClick={()=>navigate('/register')}>
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;