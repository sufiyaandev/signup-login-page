import React from 'react'
import { useNavigate } from 'react-router-dom';

function Firstpage() {

    const navigate = useNavigate();

    const handleSignin=()=>{
        navigate("/signin")
    }
    const handleLogin=()=>{
        navigate("/login");
    }
  return (
    <div>
    
      <button onClick={handleSignin}>Sign In</button>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}









    
export default Firstpage