import { QuestionsService } from "@/services/questions.service";
import { IAnswer } from "@/types/question.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface QuestionsState {
  questions?: IAnswer[];
  loadingState: boolean;

  fetchQuestions: () => Promise<void>;
  fetchQuestionsFromFolder: (folderId: number) => Promise<void>;
}

export const useQuestionsStore = create(
  devtools<QuestionsState>((set) => ({
    loadingState: false,
    fetchQuestions: async () => {
      set({
        loadingState: true,
      });
      const service = new QuestionsService();
      const questions = await service.fetchQuestions();

      return new Promise((resolve) =>
        setTimeout(() => {
          set({
            questions: questions.data.data,
            loadingState: false,
          });

          resolve();
        }, 1000),
      );
    },
    fetchQuestionsFromFolder: async (folderId: number) => {
      const service = new QuestionsService();
      const questions = await service.fetchQuestionsFromFolder(folderId);

      set({
        questions: questions.data.data,
      });
    },
  })),
);
