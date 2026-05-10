import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const loginUser = async () => {

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);

        navigate('/dashboard');

      } else {

        setMessage('Invalid credentials');

      }

    } catch (error) {

      setMessage('Server error');

    }
  };

  return (

    <div className="App">

      <div className="form-container">

        <h1>Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginUser}>
          Login
        </button>

        <p>{message}</p>

        <p>
          Not registered?
        </p>

        <Link to="/register">
          Sign up here
        </Link>

      </div>

    </div>
  );
}

export default Login;