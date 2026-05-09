import { useState } from "react";

function App() {

  const [hours, setHours] = useState("");
  const [scores, setScores] = useState("");
  const [activities, setActivities] = useState("");
  const [sleep, setSleep] = useState("");
  const [papers, setPapers] = useState("");

  const [prediction, setPrediction] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault();

    const response = await fetch(
      "http://127.0.0.1:8000/api/predict/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          hours: hours,
          scores: scores,
          activities: activities,
          sleep: sleep,
          papers: papers,
        }),
      }
    );

    const data = await response.json();

    setPrediction(data.prediction);
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Student Performance Predictor</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Hours Studied:</label>
          <br />

          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Previous Scores:</label>
          <br />

          <input
            type="number"
            value={scores}
            onChange={(e) => setScores(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Extracurricular Activities:</label>
          <br />

          <select
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <br />

        <div>
          <label>Sleep Hours:</label>
          <br />

          <input
            type="number"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Practice Papers:</label>
          <br />

          <input
            type="number"
            value={papers}
            onChange={(e) => setPapers(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Predict
        </button>

      </form>

      <br />

      <h2>Prediction: {prediction}</h2>

    </div>
  );
}

export default App;