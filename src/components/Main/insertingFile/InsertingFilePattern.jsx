import { useState } from "react";
import "./inserting.css";

const getDynamicRandomIndex = (currentLength) => {
  return Math.floor(Math.random() * currentLength);
};

export function InsertedFile({category, questionsFile}) {
  const [isGoing, setIsGoing] = useState(false);
  const [aviableQuestions, setAviableQuestions] = useState(questionsFile);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState();
  const [answer, setAnswer] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswerAmount, setCorrectAnswerAmount] = useState(0);
  const [questionsAskedAmount, setQuestionsAskedAmount] = useState(0);

  const [finished, setFinished] = useState(false);

  const answerSetting = (currentIndex, currentQuestionsList) => {
    const answerCopy = [];

    answerCopy.push(currentQuestionsList[currentIndex].answer);

    for (let i = 0; i < 3; i++) {
      const tempIndex = getDynamicRandomIndex(currentQuestionsList.length);
      const wrongAnswer = currentQuestionsList[tempIndex].answer;

      if (wrongAnswer !== currentQuestionsList[currentIndex].answer) {
        answerCopy.push(wrongAnswer);
      } else {
        answerCopy.push(currentQuestionsList[(tempIndex + 1) % currentQuestionsList.length].answer);
      }
    }

    const shuffledAnswers = answerCopy.sort(() => Math.random() - 0.5);
    setAnswer(shuffledAnswers);
  };

  const answerSelection = (ans) => {
  
    if (selectedAnswer) return;

    setSelectedAnswer(ans); 
    const isCorrect = ans === correctAnswer;

    const updatedQuestions = aviableQuestions.filter(
      (q) => q.answer !== correctAnswer,
    );

    setAviableQuestions(updatedQuestions);

    setTimeout(() => {
      setSelectedAnswer(null); 
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
    }, 2000);
  };

  const startTest = () => {
    if (isGoing) return;

    setFinished(false);
    setCorrectAnswerAmount(0);
    setQuestionsAskedAmount(0);
    setSelectedAnswer(null);

    const firstIndex = getDynamicRandomIndex(questionsFile.length);
    setAviableQuestions(questionsFile);
    setQuestion(questionsFile[firstIndex].question);
    setCorrectAnswer(questionsFile[firstIndex].answer);

    answerSetting(firstIndex, questionsFile);
    setIsGoing(true);
  };

  return (
    <div>
      =====================================================================
      <h1 className="h">{category}</h1>
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
          <h2>
            <span style={{ fontWeight: 400, fontSize: "75%" }}>Question:</span>{" "}
            {question}
          </h2>
          <h3>
            Questions answered {questionsAskedAmount}/{questionsFile.length}
            <br />
            score: {correctAnswerAmount}/{questionsAskedAmount}
          </h3>
          <ul style={{ padding: 0 }} className="buttonList">
            {answer.map((ans, idButton) => {
            
              let btnColor = "";
              if (selectedAnswer) {
                if (ans === correctAnswer) {
                  btnColor = "lime"; 
                } else if (ans === selectedAnswer) {
                  btnColor = "red"; 
                }
              }

              return (
                <li key={idButton}>
                  <button
                    style={{ backgroundColor: btnColor }}
                    className="button"
                    onClick={() => answerSelection(ans)}
                    disabled={!!selectedAnswer}
                  >
                    {ans}
                  </button>
                </li>
              );
            })}
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