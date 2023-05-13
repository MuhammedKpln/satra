import { QuestionsService } from "@/services/questions.service";
import { ICookieAuthKeys } from "@/types/auth.types";
import { IAnswer } from "@/types/question.types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface QuestionsState {
  questions?: IAnswer[];

  fetchQuestions: () => Promise<void>;
}

export const useQuestionsStore = create(
  devtools(
    persist<QuestionsState>(
      (set, _get) => ({
        fetchQuestions: async () => {
          const service = new QuestionsService();
          const questions = await service.fetchQuestions();

          set({
            questions: questions.data.data,
          });
        },
      }),
      {
        name: ICookieAuthKeys.questions,
      },
    ),
  ),
);
