import Questions from "../../DataSet/Eng.json";
import { useState } from "react";
import "./eko.css";

const getDynamicRandomIndex = (currentLength) => {
  return Math.floor(Math.random() * currentLength);
};

export function Ekonomika() {
  const [isGoing, setIsGoing] = useState(false);
  const [aviableQuestions, setAviableQuestions] = useState(Questions);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState();
  const [answer, setAnswer] = useState([]);
  const [answerColor, setColorAnswer] = useState();
  const [correctAnswerAmount, setCorrectAnswerAmount] = useState(0);
  const [questionsAskedAmount, setQuestionsAskedAmount] = useState(0);

  const [finished, setFinished] = useState(false);

  const answerSetting = (currentIndex, currentQuestionsList) => {
    const answerCopy = [];

    answerCopy.push(currentQuestionsList[currentIndex].answer);

    // 2. Додаємо 3 варіанти з загального датасету (engQuestions)
    for (let i = 0; i < 3; i++) {
      const tempIndex = getDynamicRandomIndex(Questions.length);
      const wrongAnswer = Questions[tempIndex].answer;

      if (wrongAnswer !== currentQuestionsList[currentIndex].answer) {
        answerCopy.push(wrongAnswer);
      } else {
        answerCopy.push(Questions[(tempIndex + 1) % Questions.length].answer);
      }
    }

    const shuffledAnswers = answerCopy.sort(() => Math.random() - 0.5);
    setAnswer(shuffledAnswers);
  };

  const answerSelection = (ans) => {
    const isCorrect = ans === correctAnswer;
    setColorAnswer(isCorrect ? "lime" : "red");

    const updatedQuestions = aviableQuestions.filter(
      (q) => q.answer !== correctAnswer,
    );

    setAviableQuestions(updatedQuestions);

    setTimeout(() => {
      setColorAnswer("");
      setQuestionsAskedAmount((prev) => prev + 1);

      if (isCorrect) {
        setCorrectAnswerAmount((prev) => prev + 1);
      }

      if (updatedQuestions.length === 0) {
        setIsGoing(false);
        setFinished(true);
        return;
      }

      const newIndex = getDynamicRandomIndex(updatedQuestions.length);

      setQuestion(updatedQuestions[newIndex].question);
      setCorrectAnswer(updatedQuestions[newIndex].answer);

      answerSetting(newIndex, updatedQuestions);
    }, 1000);
  };

  const startTest = () => {
    if (isGoing) return;

    const firstIndex = getDynamicRandomIndex(Questions.length);
    setAviableQuestions(Questions);
    setQuestion(Questions[firstIndex].question);
    setCorrectAnswer(Questions[firstIndex].answer);

    answerSetting(firstIndex, Questions);
    setIsGoing(true);
  };

  return (
    <div>
      =====================================================================
      <h1 className="h">EKO</h1>
      <button
        onClick={startTest}
        style={{
          width: "fit-content",
          height: "fit-content",
          padding: "10px",
          borderRadius: "15px",
          border: "1px solid black",
          backgroundColor: "pink",
        }}
      >
        Start test
      </button>
      <br />
      =====================================================================
      {isGoing ? (
        <div>
          <h2>{question}</h2>
          <h3>
            Questions answered {questionsAskedAmount}/{Questions.length}
          </h3>
          <ul style={{ padding: 0 }} className="buttonList">
            {answer.map((ans, idButton) => (
              <li key={idButton}>
                <button
                  style={{ backgroundColor: answerColor }}
                  className="button"
                  onClick={() => answerSelection(ans)}
                >
                  {ans}
                </button>
              </li>
            ))}
          </ul>
          =====================================================================
        </div>
      ) : null}
      <div>
        {finished ? (
          <div>
            Test Finished, score: {correctAnswerAmount}/{questionsAskedAmount}{" "}
            <br /> =======================
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
