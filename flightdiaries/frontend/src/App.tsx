import { useEffect, useState } from "react";
import type { Visibility, Weather, DiaryEntry } from "./types";
import diaryService from "./services/diaryService";
import axios from "axios";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    diaryService.getAll().then((initialDiaries) => {
      setDiaries(initialDiaries);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryToAdd = {
      date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment,
    };
    try {
      const returnedDiary = await diaryService.create(diaryToAdd);
      setDiaries(diaries.concat(returnedDiary));
      setError("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error[0].message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Add new diary</h2>

      <form onSubmit={diaryCreation}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>
            date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            visibility
            <input
              type="text"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            weather
            <input
              type="text"
              value={weather}
              onChange={(event) => setWeather(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            comment
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diaries</h2>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h4>{diary.date}</h4>
          <p>weather was {diary.weather}</p>{" "}
          <p>visibility was {diary.visibility}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
