import { IRightAnswers } from "@/types/question.types";
import { decryptText } from "@/utils/decrypt";
import {
  Button,
  Collapse,
  Grid,
  Image,
  Modal,
  Progress,
  Text,
  useTheme,
} from "@nextui-org/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import styles from "../slutprov.module.scss";
import { IIsCorrectAnswer, QuizResultsAnswer } from "./answer.component";

interface IProps {
  isVisible: boolean;
  onCloseHandler: () => void;
  isApproved: boolean;
  wrongAnswers: IRightAnswers[];
  correctAnswers: IRightAnswers[];
  percentage: number;
}

export function QuizResultsModal({
  isVisible,
  onCloseHandler,
  isApproved,
  percentage,
  correctAnswers,
  wrongAnswers,
}: IProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const correctAnswer = useCallback(
    (choosenAnswer: number, answer: IRightAnswers) => {
      const correctAnswer = Number(
        answer.questionData.question.right_answer.replace("answer", ""),
      );

      if (choosenAnswer === correctAnswer) {
        return IIsCorrectAnswer.CORRECT;
      }

      if (
        choosenAnswer === answer.choosenAnswer &&
        choosenAnswer !== correctAnswer
      ) {
        return IIsCorrectAnswer.UNCORRECT;
      }

      return IIsCorrectAnswer.NONE;
    },
    [],
  );

  return (
    <Modal blur scroll width="100%" open={isVisible} onClose={onCloseHandler}>
      <Modal.Header autoMargin={false} justify="flex-end">
        <Button light auto onPress={onCloseHandler}>
          <IoCloseCircleOutline
            size={30}
            color={theme.theme?.colors.gray700.value}
          />
        </Button>
      </Modal.Header>
      <Modal.Body
        css={{
          padding: "2rem",
        }}
      >
        <Grid.Container
          justify="center"
          alignItems="center"
          alignContent="center"
          display="flex"
          gap={2}
        >
          <Grid
            xs={12}
            justify="center"
            alignItems="center"
            alignContent="center"
            direction="column"
          >
            {isApproved ? (
              <IoCheckmarkCircleOutline
                size={60}
                color={theme.theme?.colors.green600.value}
              />
            ) : (
              <IoCloseCircleOutline
                size={60}
                color={theme.theme?.colors.red600.value}
              />
            )}

            {isApproved ? (
              <Text>{t("approved")}</Text>
            ) : (
              <Text color={theme.theme?.colors.red600.value}>
                {t("dapproved")}
              </Text>
            )}
          </Grid>

          <Grid
            xs={12}
            direction="row"
            justify="center"
            alignItems="center"
            alignContent="center"
          >
            <div className={styles.answersContainer}>
              <IoCheckmarkCircleOutline
                size={60}
                color={theme.theme?.colors.green600.value}
              />
              <Text>
                {correctAnswers.length} {t("correct")}
              </Text>
            </div>
            <div className={styles.answersContainer}>
              <IoCloseCircleOutline
                size={60}
                color={theme.theme?.colors.red600.value}
              />

              <Text>
                {wrongAnswers.length} {t("wrong")}
              </Text>
            </div>
          </Grid>

          <Grid xs={6}>
            <Progress
              shadow
              max={100}
              color={percentage > 50 ? "success" : "error"}
              value={percentage}
            />
          </Grid>

          <Grid xs={8}>
            <Collapse.Group bordered css={{ width: "100%" }}>
              <Collapse
                css={{
                  h3: { fontSize: "$md" },
                }}
                title={t("lookForWrongQuestions")}
              >
                <Collapse.Group splitted>
                  {wrongAnswers.map((e) => (
                    <Collapse
                      title={decryptText(e.questionData.question.title_hashed)}
                      subtitle={decryptText(
                        e.questionData.question.description_hashed,
                      )}
                      css={{
                        boxShadow: "$lg",
                      }}
                      shadow
                    >
                      <Grid.Container gap={1}>
                        {e.questionData.question.image && (
                          <Grid xs={12} justify="center">
                            <Image
                              src={e.questionData.question.image}
                              autoResize
                            />
                          </Grid>
                        )}

                        <Grid xs={12}>
                          <QuizResultsAnswer
                            title={decryptText(e.questionData.answer1_hashed)}
                            isCorrect={correctAnswer(1, e)!}
                          />
                        </Grid>

                        {e.questionData.answer2_hashed && (
                          <Grid xs={12}>
                            <QuizResultsAnswer
                              title={decryptText(e.questionData.answer2_hashed)}
                              isCorrect={correctAnswer(2, e)!}
                            />
                          </Grid>
                        )}
                        {e.questionData.answer3_hashed && (
                          <Grid xs={12}>
                            <QuizResultsAnswer
                              title={decryptText(e.questionData.answer3_hashed)}
                              isCorrect={correctAnswer(3, e)!}
                            />
                          </Grid>
                        )}
                        {e.questionData.answer4_hashed && (
                          <Grid xs={12}>
                            <QuizResultsAnswer
                              title={decryptText(e.questionData.answer4_hashed)}
                              isCorrect={correctAnswer(4, e)!}
                            />
                          </Grid>
                        )}
                      </Grid.Container>
                    </Collapse>
                  ))}
                </Collapse.Group>
              </Collapse>
            </Collapse.Group>
          </Grid>
        </Grid.Container>
      </Modal.Body>

      <Modal.Footer>
        <Button auto flat color="error" onPress={onCloseHandler}>
          {t("goBackToTests")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
