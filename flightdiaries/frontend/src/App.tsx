import { useEffect, useState } from "react";
import type { DiaryEntry } from "./types";
import diaryService from "./services/diaryService";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  useEffect(() => {
    diaryService.getAll().then((initialDiaries) => {
      setDiaries(initialDiaries);
    });
  }, []);
  return (
    <div>
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
