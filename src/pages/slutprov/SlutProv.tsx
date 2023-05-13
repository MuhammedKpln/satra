import { Answer } from "@/components/answer.component";
import { useQuestionsStore } from "@/stores/questions.store";
import { IAnswer, IMarkedQuizzes, IRightAnswers } from "@/types/question.types";
import { decryptText } from "@/utils/decrypt";
import {
  Button,
  Container,
  Grid,
  Image,
  Row,
  Text,
  useTheme,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { QuizResultsModal } from "./components/quiz-results.component";
import styles from "./slutprov.module.scss";

export default function Component() {
  const fetchQuestions = useQuestionsStore((state) => state.fetchQuestions);
  const questions = useQuestionsStore((state) => state.questions);
  const [currentQuestion, setCurrentQuestion] = useState<IAnswer>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [finishedWithMarkedQuestions, setFinishedWithMarkedQuestions] =
    useState<boolean>(false);
  const [finishedQuiz, setFinishedQuiz] = useState<boolean>(false);
  const userLastQuestionIndex = useRef<number>();
  const [finishedQuizzes, setFinishedQuizzes] = useState<IRightAnswers[]>([]);
  const markedQuizzes = useRef<IMarkedQuizzes[]>([]);
  const [timer, setTimer] = useState<string>("50:00");
  const { theme } = useTheme();
  const navigate = useNavigate();

  const minimumCorrectAnswers = useMemo(() => {
    return finishedQuizzes.length - 2;
  }, [finishedQuizzes]);
  const correctAnswers = useMemo(() => {
    return finishedQuizzes.filter(
      (v) => v.isCorrectAnswer === true && v.isMarked === false,
    );
  }, [finishedQuizzes]);
  const wrongAnswers = useMemo(() => {
    return finishedQuizzes.filter(
      (v) => v.isCorrectAnswer === false && v.isMarked === false,
    );
  }, [finishedQuizzes]);
  const isApproved = useMemo(() => {
    if (correctAnswers.length >= minimumCorrectAnswers) {
      return true;
    }

    return false;
  }, [correctAnswers, minimumCorrectAnswers]);
  const calculatePercentage = useMemo(() => {
    return Math.round((correctAnswers.length * 100) / finishedQuizzes.length);
  }, [correctAnswers, finishedQuizzes]);

  useEffect(() => {
    // Fetch questions on mount.
    fetchQuestions().then(() => {
      if (questions) {
        setCurrentQuestion(questions[currentQuestionIndex]);

        countdown(50);
      }
    });
  }, []);

  useEffect(() => {
    checkIfQuizFinished(currentQuestionIndex);
  }, [currentQuestionIndex]);

  function checkIfQuizFinished(questionIndex: number) {
    if (questionIndex >= questions!.length) {
      console.log(markedQuizzes.current.length);
      if (markedQuizzes.current.length > 0) {
        // Quiz is finished, but there is marked question available.
        toast.error("You have marked questions available");
        setCurrentQuestion(questions![0]);
        setCurrentQuestionIndex(0);
        setFinishedWithMarkedQuestions(true);

        return;
      }

      setFinishedQuiz(true);
    }
  }

  const chooseAnswer = useCallback(
    (answer: number) => {
      const correctAnswer = Number(
        currentQuestion?.question.right_answer.replace("answer", ""),
      );

      const isAlreadyAnsweredIndex = finishedQuizzes.findIndex(
        (e) => e.questionIndex == currentQuestionIndex,
      );

      if (isAlreadyAnsweredIndex != -1) {
        if (answer === correctAnswer) {
          setFinishedQuizzes((state) => {
            state[isAlreadyAnsweredIndex].isCorrectAnswer = true;
            state[isAlreadyAnsweredIndex].choosenAnswer = answer;
            state[isAlreadyAnsweredIndex].isMarked = false;

            return [...state];
          });
        } else {
          setFinishedQuizzes((state) => {
            state[isAlreadyAnsweredIndex].isCorrectAnswer = false;
            state[isAlreadyAnsweredIndex].choosenAnswer = answer;
            state[isAlreadyAnsweredIndex].isMarked = false;
            return [...state];
          });
        }

        if (userLastQuestionIndex.current) {
          jumpToQuiz(userLastQuestionIndex.current);
          userLastQuestionIndex.current = undefined;
        }

        return;
      }

      if (answer === correctAnswer) {
        setFinishedQuizzes([
          ...finishedQuizzes,
          {
            choosenAnswer: answer,
            questionIndex: currentQuestionIndex,
            questionData: currentQuestion!,
            isCorrectAnswer: true,
            isMarked: false,
          },
        ]);
      } else {
        setFinishedQuizzes([
          ...finishedQuizzes,
          {
            choosenAnswer: answer,
            questionIndex: currentQuestionIndex,
            questionData: currentQuestion!,
            isCorrectAnswer: false,
            isMarked: false,
          },
        ]);
      }

      jumpToNextQuiz();
    },
    [
      currentQuestion,
      currentQuestionIndex,
      userLastQuestionIndex,
      finishedQuizzes,
      userLastQuestionIndex,
    ],
  );

  const jumpToNextQuiz = useCallback(
    (userInvoked = false) => {
      if (userInvoked) {
        setFinishedQuizzes([
          ...finishedQuizzes,
          {
            choosenAnswer: 0,
            questionIndex: currentQuestionIndex,
            questionData: currentQuestion!,
            isCorrectAnswer: false,
            isMarked: false,
          },
        ]);
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      setCurrentQuestion(questions![currentQuestionIndex + 1]);
    },
    [currentQuestionIndex, currentQuestion],
  );

  const jumpToQuiz = useCallback(
    (qIndex: number) => {
      userLastQuestionIndex.current = currentQuestionIndex;
      setCurrentQuestionIndex(qIndex);
      setCurrentQuestion(questions![currentQuestionIndex]);
    },
    [currentQuestionIndex],
  );

  const markQuizForLater = useCallback(() => {
    markedQuizzes.current.push({
      questionIndex: currentQuestionIndex,
      questionData: currentQuestion!,
    });

    setFinishedQuizzes([
      ...finishedQuizzes,
      {
        choosenAnswer: undefined,
        questionIndex: currentQuestionIndex,
        questionData: currentQuestion!,
        isCorrectAnswer: false,
        isMarked: true,
      },
    ]);

    jumpToNextQuiz();
  }, [currentQuestion, currentQuestionIndex]);

  const closeQuiz = useCallback(() => {
    setFinishedQuiz(true);
  }, []);

  function countdown(minutes: number) {
    let seconds = 60;
    const mins = minutes;
    function tick() {
      const current_minutes = mins - 1;
      seconds--;
      setTimer(
        current_minutes.toString() +
          ":" +
          (seconds < 10 ? "0" : "") +
          String(seconds),
      );

      if (seconds > 0) {
        setTimeout(tick, 1000);
      } else {
        if (mins > 1) {
          countdown(mins - 1);
        }
      }
    }
    tick();
  }

  return (
    <>
      <Container xs>
        <Row justify="center" wrap="wrap">
          {finishedQuizzes.map((e) => (
            <div
              className={
                e.questionIndex == currentQuestionIndex
                  ? styles.currentQuizIndicator
                  : styles.completedQuizIndicator
              }
              onClick={() => jumpToQuiz(e.questionIndex)}
              key={e.questionIndex}
              style={
                e.questionIndex == currentQuestionIndex
                  ? { backgroundColor: theme?.colors.green500.value }
                  : e.isMarked
                  ? { backgroundColor: theme?.colors.yellow500.value }
                  : undefined
              }
            />
          ))}

          {finishedQuizzes.length == currentQuestionIndex ? (
            <div
              className={styles.currentQuizIndicator}
              style={{ backgroundColor: theme?.colors.green500.value }}
              key={currentQuestionIndex}
            />
          ) : null}
        </Row>
      </Container>
      <Grid.Container gap={2}>
        {currentQuestion && !finishedQuiz && (
          <>
            <Grid xs={12} justify="center" className={styles.question}>
              <Image src={currentQuestion.question.image} autoResize />
            </Grid>
            <Grid xs={12} justify="center" className={styles.question}>
              <Text h4>
                {decryptText(currentQuestion.question.title_hashed)}
              </Text>
            </Grid>
            <Grid xs={12} justify="center" className={styles.question}>
              <Text h4>{timer}</Text>
            </Grid>
            <Grid xs={6}>
              <Answer
                title={decryptText(currentQuestion.answer1_hashed)}
                onPress={() => chooseAnswer(1)}
              />
            </Grid>
            <Grid xs={6}>
              <Answer
                title={decryptText(currentQuestion.answer2_hashed)}
                onPress={() => chooseAnswer(2)}
              />
            </Grid>
            <Grid xs={6}>
              <Answer
                title={decryptText(currentQuestion.answer3_hashed)}
                onPress={() => chooseAnswer(3)}
              />
            </Grid>
            <Grid xs={6}>
              <Answer
                title={decryptText(currentQuestion.answer4_hashed)}
                onPress={() => chooseAnswer(4)}
              />
            </Grid>

            <Button onPress={markQuizForLater}>Mark question</Button>

            {finishedWithMarkedQuestions && (
              <Button onPress={closeQuiz}>Finish</Button>
            )}
          </>
        )}
      </Grid.Container>

      <QuizResultsModal
        isVisible={finishedQuiz}
        onCloseHandler={() => navigate("/")}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        isApproved={isApproved}
        percentage={calculatePercentage}
      />
    </>
  );
}
