import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const registerUser = async () => {

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/register/',
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

        navigate('/');

      } else {

        setMessage(data.error);

      }

    } catch (error) {

      setMessage('Server error');

    }
  };

  return (

    <div className="App">

      <div className="form-container">

        <h1>Register</h1>

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

        <button onClick={registerUser}>
          Register
        </button>

        <p>{message}</p>

        <Link to="/">
          Back to login
        </Link>

      </div>

    </div>
  );
}

export default Register;