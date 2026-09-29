/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import engQuestions from "../DataSet/Eng.json";
import { useState, useEffect } from "react";
export function English() {
  const [isGoing, setIsGoing] = useState(false);

  const [randomNumber, setRandomNumber] = useState();

  const [aviableQuestions, setAviableQuestions] = useState(engQuestions);
  const [question, setQuestion] = useState(null);

  const [correctAnswer, serCorrectAnswer] = useState();
  const [answer, setAnswer] = useState([]);

  const randomIndex = () =>
    setRandomNumber(Math.floor(Math.random() * engQuestions.length));
  const randomIndexOneTime = () => {
    return Math.floor(Math.random() * engQuestions.length);
  };
  useEffect(() => {
    randomIndex();
    for (let i = 0; i < aviableQuestions.length; i++) {
      console.log(aviableQuestions[i].id);
    }
  }, []);

  const answerSelection = () => {};
  const answerSetting = () => {
    const answerCopy = [...answer];

    for (let i = 0; i < 3; i++) {
      const tempIndex = randomIndexOneTime();
      if (tempIndex !== randomNumber) {
        answerCopy.push(aviableQuestions[tempIndex].answer);
      } else if (tempIndex === randomNumber) {
        answerCopy.push(aviableQuestions[randomIndexOneTime()].answer);
      }
    }
    answerCopy.push(aviableQuestions[randomIndexOneTime()].answer);

    const shuffledAnswers = answerCopy.sort(() => Math.random() - 0.5);
    shuffledAnswers.slice(0, 4);
    setAnswer(shuffledAnswers);
  };

  const startTest = () => {
    if (isGoing) {
      return;
    }
    answerSetting();
    setQuestion(aviableQuestions[randomNumber].question);
    setIsGoing(true);
  };

  const handleSelection = (idButton) => {};
  return (
    <div>
      ENG
      <button onClick={startTest}>Start test</button>
      {isGoing ? (
        <div>
          <h2>{question}</h2>
          <ul>
            {answer.map((ans, idButton) => {
              return (
                <button
                  key={idButton}
                  onClick={() => {
                    console.log(idButton);
                    handleSelection(idButton);
                  }}
                >
                  {ans}
                </button>
              );
            })}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
