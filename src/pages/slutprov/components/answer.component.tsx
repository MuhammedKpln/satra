import { decryptText } from "@/utils/decrypt";
import { useMemo } from "react";
import styles from "../slutprov.module.scss";

interface IProps {
  isCorrect: IIsCorrectAnswer;
  title: string;
}

export enum IIsCorrectAnswer {
  CORRECT,
  UNCORRECT,
  NONE,
}

export function QuizResultsAnswer({ isCorrect, title }: IProps) {
  const isCorrectComputed = useMemo(() => {
    if (isCorrect == IIsCorrectAnswer.CORRECT) {
      return styles.correct;
    }

    if (isCorrect == IIsCorrectAnswer.UNCORRECT) {
      return styles.wrong;
    }
  }, [isCorrect]);

  return (
    <div className={`${styles.quizResultsAnswer} ${isCorrectComputed}`}>
      {decryptText(title)}
    </div>
  );
}
