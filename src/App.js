import React from 'react';
import './App.css';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Chat from './views/Chat';
import CreateRoom from './views/CreateRoom';
import SocketProvider from './components/socket/SocketProvider';

const App = ()=> {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <CreateRoom />
        },
        {
            path: '/chat',
            element: 
                <SocketProvider>
                    <Chat />
                </SocketProvider>
        },
        {
            path: '*',
            element: <Navigate to='/' />
        }
    ])

  return (
      <div className="App">
            <RouterProvider router={router} />
      </div>
  );
}

export default App;
