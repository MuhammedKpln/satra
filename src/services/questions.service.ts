import { IAnswer, IPagination } from "@/types/question.types";
import { BaseService } from "./base.service";

export class QuestionsService extends BaseService {
  async fetchQuestions() {
    return this.get<IPagination<IAnswer[]>>("/questions");
  }
  async fetchQuestionsFromFolder(folderId: number) {
    return this.get<IPagination<IAnswer[]>>("/folder/" + folderId);
  }
}
