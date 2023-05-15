import { Answer } from "@/components/answer.component";
import { useQuestionsStore } from "@/stores/questions.store";
import {
  IAnswer,
  IAvailableQuestionAnswers,
  IMarkedQuizzes,
  IRightAnswers,
} from "@/types/question.types";
import { decryptText } from "@/utils/decrypt";
import {
  Button,
  Container,
  Grid,
  Image,
  Row,
  Text,
  Tooltip,
  useTheme,
} from "@nextui-org/react";
import { t } from "i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
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

  const shouldRenderImage = useMemo<boolean>(() => {
    if (currentQuestion?.question.image_attr.includes("noimage.jpg")) {
      return false;
    }

    return true;
  }, [currentQuestion]);

  const questionAnswers = useMemo<
    IAvailableQuestionAnswers[] | undefined
  >(() => {
    if (!currentQuestion) return;

    const questionKeys = Object.keys(currentQuestion!);
    const questions: IAvailableQuestionAnswers[] = [];

    for (let index = 0; index < questionKeys.length; index++) {
      let element = questionKeys[index];
      const value = Object.values(currentQuestion)[index];

      if (element.startsWith("answer")) {
        element = element.replace("answer", "");
        element = element.replace("_hashed", "");

        if (value != null) {
          questions.push({
            label: value,
            value: parseInt(element),
          });
        }
      }
    }

    return questions;
  }, [currentQuestion]);

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
    // Check if questions has been requested before, if not request it.

    function init() {
      if (questions) {
        setCurrentQuestion(questions[currentQuestionIndex]);

        countdown(50);
      }
    }

    if (!questions) {
      // Question has not been requested. Create new request.
      fetchQuestions().then(init);
    } else {
      // Question has already been requested, initialize it.
      init();
    }
  }, []);

  useEffect(() => {
    checkIfQuizFinished(currentQuestionIndex);
  }, [currentQuestionIndex]);

  function checkIfQuizFinished(questionIndex: number) {
    if (questionIndex >= questions!.length) {
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
            isMarked: true,
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

  const navigateBack = useCallback(() => {
    navigate("/");
  }, []);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setCurrentQuestion(questions![currentQuestionIndex - 1]);
  }, [currentQuestionIndex, questions]);

  console.log(currentQuestion);

  return (
    <>
      <Button
        onPress={navigateBack}
        rounded
        auto
        ghost
        css={{ borderRadius: "$xl" }}
      >
        <IoArrowBack />
      </Button>

      <Container xl>
        <Row justify="center" wrap="wrap">
          {finishedQuizzes.map((e) => (
            <Tooltip
              content={decryptText(e.questionData.question.title_hashed)}
              color="primary"
              css={undefined}
              contentColor={undefined}
            >
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
            </Tooltip>
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
            {shouldRenderImage && (
              <Grid xs={12} justify="center" className={styles.question}>
                <Image src={currentQuestion.question.image_attr} autoResize />
              </Grid>
            )}

            <Grid xs={12} justify="center" className={styles.question}>
              <Text h4>
                {decryptText(currentQuestion.question.title_hashed)}
              </Text>
            </Grid>
            <Grid xs={12} justify="center" className={styles.question}>
              <Text h4>{timer}</Text>
            </Grid>

            {questionAnswers?.map((e) => (
              <Grid xs={6} key={e.value}>
                <Answer
                  title={decryptText(e.label)}
                  onPress={() => chooseAnswer(e.value)}
                />
              </Grid>
            ))}

            <Grid xs={12} justify="space-between">
              {currentQuestionIndex !== 0 && (
                <Button onPress={prevQuestion} icon={<IoArrowBack size={20} />}>
                  {t("prevQuestion")}
                </Button>
              )}

              <Button
                icon={<IoTimeOutline size={20} />}
                color="warning"
                onPress={markQuizForLater}
              >
                {t("markQuestion")}
              </Button>

              {finishedWithMarkedQuestions && (
                <Button
                  icon={<IoCheckmarkCircleOutline size={20} />}
                  color="success"
                  onPress={closeQuiz}
                >
                  {t("finishQuiz")}
                </Button>
              )}
              <Button
                iconRight={<IoArrowForward size={20} />}
                onPress={() => jumpToNextQuiz(true)}
              >
                {t("nextQuestion")}
              </Button>
            </Grid>
          </>
        )}
      </Grid.Container>

      <QuizResultsModal
        isVisible={finishedQuiz}
        onCloseHandler={navigateBack}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        isApproved={isApproved}
        percentage={calculatePercentage}
      />
    </>
  );
}
