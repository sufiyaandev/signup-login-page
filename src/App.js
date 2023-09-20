import React from 'react';
import Home from './components/Home';
import {Routes,Route,} from 'react-router-dom'
import Signin from './components/Signin';
import Login from './components/Login';
import Firstpage from './components/Firstpage';

function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Firstpage/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </div>
  );
}

export default App;
