import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import AuthCheck from './hoc/AuthCheck';
import Users from './Pages/Users';
import UserPermCheck from './hoc/UserPermCheck';
import Collections from './Pages/Messages';
import { useState } from 'react';
import Groups from './Pages/Groups';
import Messages from './Pages/Messages';
import AddMessage from './Pages/AddMessage';
import EditMessage from './Pages/EditMessage';

function App() {

  const [authToken, setAuthToken] = useState('')

  return (
    <section className='board'>

      <BrowserRouter basename='/'>
        <Navbar authToken={authToken} setAuthToken={setAuthToken} />
        <div className='container'>
          <Routes>
            <Route exact path='/' element={
              <AuthCheck>
                <Groups />
              </AuthCheck>
            } />
            <Route exact path='/groups' element={
              <AuthCheck>
                <Groups />
              </AuthCheck>
            } />
            <Route exact path='/messages' element={
              <AuthCheck>
                <Messages />
              </AuthCheck>
            } />
            <Route exact path='/addnewmessage' element={
              <AuthCheck>
                <AddMessage />
              </AuthCheck>
            } />
            <Route exact path='/editmessage/*' element={
              <AuthCheck>
                <EditMessage />
              </AuthCheck>
            } />
            <Route exact path='/users' element={
              <AuthCheck>
                <Users />
              </AuthCheck>
            } />
            <Route exact path='/login' element={<Login setAuthToken={setAuthToken} />} />
          </Routes>
        </div>
      </BrowserRouter>

    </section>
  );
}

export default App;
