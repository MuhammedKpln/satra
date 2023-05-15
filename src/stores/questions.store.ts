import { QuestionsService } from "@/services/questions.service";
import { IAnswer } from "@/types/question.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface QuestionsState {
  questions?: IAnswer[];

  fetchQuestions: () => Promise<void>;
  fetchQuestionsFromFolder: (folderId: number) => Promise<void>;
}

export const useQuestionsStore = create(
  devtools<QuestionsState>((set) => ({
    fetchQuestions: async () => {
      const service = new QuestionsService();
      const questions = await service.fetchQuestions();

      set({
        questions: questions.data.data,
      });
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
