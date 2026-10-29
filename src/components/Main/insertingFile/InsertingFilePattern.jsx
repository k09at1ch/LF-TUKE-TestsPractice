import { useEffect, useState, useRef } from "react";
import "./inserting.css";

const getDynamicRandomIndex = (currentLength) => {
  return Math.floor(Math.random() * currentLength);
};

export function InsertedFile({ category, questionsFile }) {
  const [isGoing, setIsGoing] = useState(false);
  const [aviableQuestions, setAviableQuestions] = useState(questionsFile);
  const [question, setQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState();
  const [answer, setAnswer] = useState([]);

  const answerAmount = useRef(
    localStorage.getItem("answerAmount")
      ? Number(localStorage.getItem("answerAmount"))
      : 4,
  );
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswerAmount, setCorrectAnswerAmount] = useState(0);
  const [questionsAskedAmount, setQuestionsAskedAmount] = useState(0);

  const [finished, setFinished] = useState(false);

  const permanentQuestions = questionsFile;
  useEffect(() => {
    const storedAmount = localStorage.getItem("answerAmount");
    answerAmount.current = storedAmount ? Number(storedAmount) : 4;
    console.log("Current answer amount:", answerAmount.current);
  }, [aviableQuestions]);

  const answerSetting = (currentIndex, currentQuestionsList) => {
    //пуш правильної відповіді
    const answerCopy = [];
    answerCopy.push(currentQuestionsList[currentIndex].answer);

    //додавання 3 неправильних відповідей
    if (permanentQuestions.length >= answerAmount.current) {
      while (answerCopy.length < answerAmount.current) {
        const tempIndex = getDynamicRandomIndex(permanentQuestions.length);
        const randomAnswer = permanentQuestions[tempIndex].answer;

        if (!answerCopy.includes(randomAnswer)) {
          answerCopy.push(randomAnswer);
        }
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
    }, 500);
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
      {/* ===================================================================== */}
      <div className="cardCenter">
        <h1 className="h">{category}</h1>
        {isGoing ? (
          //hidden div to prevent clicking on the start button while the test is ongoing
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: "-999999",
              opacity: 0,
              width: "1px",
              height: "1px",
            }}
          ></div>
        ) : (
          <button onClick={startTest} className="startButton">
            Start test
          </button>
        )}
      </div>
      =====================================================================
      {isGoing ? (
        <div>
          <h2 className="cardCenter">{question}</h2>
          <h3 style={{ margin: 0 }}>
            Question: {questionsAskedAmount}/{questionsFile.length}
            <br />
            score: {correctAnswerAmount}/{questionsAskedAmount}
          </h3>
          <ul style={{ padding: 0 }} className="buttonList">
            {answer.map((ans, idButton) => {
              let btnColor = "#3B82F6";
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
          {/* ===================================================================== */}
        </div>
      ) : null}
      <div>
        {finished ? (
          <div style={{ fontWeight: 700, fontSize: "24px" }}>
            Test Finished, score: {correctAnswerAmount}/{questionsAskedAmount}{" "}
            {/* <br /> ======================= */}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
