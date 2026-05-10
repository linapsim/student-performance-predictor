import '../App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();

  const [hours, setHours] = useState('');
  const [scores, setScores] = useState('');
  const [activities, setActivities] = useState('');
  const [sleep, setSleep] = useState('');
  const [papers, setPapers] = useState('');

  const [prediction, setPrediction] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {

    loadPredictions();

  }, []);

  const logout = () => {

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    navigate('/');
  };

  const loadPredictions = async () => {

    const token = localStorage.getItem('access');

    if (!token) {

      navigate('/');

      return;
    }

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/predictions/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      setHistory(Array.isArray(data) ? data : []);

    } catch (error) {

      console.log(error);

      setHistory([]);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !hours ||
      !scores ||
      !activities ||
      !sleep ||
      !papers
    ) {

      setPrediction('Please fill all fields');

      return;
    }

    if (hours < 0) {

      setPrediction('Hours cannot be negative');

      return;
    }

    if (scores < 0 || scores > 100) {

      setPrediction('Scores must be between 0 and 100');

      return;
    }

    if (sleep < 0 || sleep > 24) {

      setPrediction('Sleep hours must be between 0 and 24');

      return;
    }

    if (papers < 0) {

      setPrediction('Practice papers cannot be negative');

      return;
    }

    const token = localStorage.getItem('access');

    if (!token) {

      navigate('/');

      return;
    }

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/predict/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            hours,
            scores,
            activities,
            sleep,
            papers
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {

        setPrediction(data.prediction);

        loadPredictions();

      } else {

        setPrediction(
          data.error || 'Prediction failed'
        );

      }

    } catch (error) {

      console.log(error);

      setPrediction('Server error');

    }
  };

  const deletePrediction = async (id) => {

    const token = localStorage.getItem('access');

    if (!token) {

      navigate('/');

      return;
    }

    console.log(id);

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/api/delete/${id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log(data);

      loadPredictions();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="App">

      <h1>Student Performance Predictor</h1>

      <div className="dashboard-card">

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

        <form onSubmit={handleSubmit}>

          <input
            type="number"
            min="0"
            placeholder="Hours Studied"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <input
            type="number"
            min="0"
            max="100"
            placeholder="Previous Scores"
            value={scores}
            onChange={(e) => setScores(e.target.value)}
          />

          <select
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          >
            <option value="">Activities</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <input
            type="number"
            min="0"
            max="24"
            placeholder="Sleep Hours"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="Practice Papers"
            value={papers}
            onChange={(e) => setPapers(e.target.value)}
          />

          <button type="submit">
            Predict
          </button>

        </form>

        <div
          className={`prediction-box ${
            prediction === 'PASS'
              ? 'pass'
              : prediction === 'FAIL'
              ? 'fail'
              : ''
          }`}
        >
          Prediction: {prediction}
        </div>

      </div>

      <div className="history-container">

        <h2 className="history-title">
          Prediction History
        </h2>

        <table>

          <thead>

            <tr>
              <th>Hours</th>
              <th>Scores</th>
              <th>Activities</th>
              <th>Sleep</th>
              <th>Papers</th>
              <th>Result</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {Array.isArray(history) &&
              history.map((item) => (

                <tr key={item.id}>

                  <td>{item.hours}</td>

                  <td>{item.scores}</td>

                  <td>
                    {item.activities === 1
                      ? 'Yes'
                      : 'No'}
                  </td>

                  <td>{item.sleep}</td>

                  <td>{item.papers}</td>

                  <td>{item.result}</td>

                  <td>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deletePrediction(item.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;