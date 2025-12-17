import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Register.css"; 

function Register(){

    const[name,setName]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')

    const navigate=useNavigate()

    const handleSubmit = async(e)=>{
        e.preventDefault()

        const formData = { name, email, password }

        try{
            const response = await axios.post('http://localhost:5000/auth/register', formData)

            if(response.data.success){
                navigate('/')
            }else{
                alert(response.data.message)
            }

            setName('')
            setEmail('')
            setPassword('')

        }catch(err){
            alert('Registration failed')
        }
    }

    return(
        <div className="register-container">

            <form className="register-card" onSubmit={handleSubmit}>
                <h2 className="register-title">Register</h2>

                <input 
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="register-input"
                />

                <input 
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="register-input"
                />

                <input 
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="register-input"
                />

                <button type="submit" className="register-btn">Register</button>

                <p className="register-footer">
                    Already registered? 
                    <span className="register-link" onClick={()=>navigate('/')}>
                        Login here
                    </span>
                </p>

            </form>
        </div>
    )
}
export default Register;