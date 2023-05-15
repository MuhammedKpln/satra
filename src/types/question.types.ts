export interface IPagination<T> {
  current_page: number;
  data: T;
  first_page_url: string;
  from: number;
  to: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  total: number;
}

export interface IQuestion {
  id: number;
  title_hashed: string;
  description_hashed: string;
  image_attr: string;
  right_answer: string;
  folder: number;
  created_at: Date;
  updated_at: Date;
}

export interface IAnswer {
  id: number;
  question_id: string;
  answer1_hashed: string;
  answer2_hashed: string;
  answer3_hashed: string;
  answer4_hashed: string;
  reserved?: string;
  created_at: string;
  updated_at: string;
  question: IQuestion;
}

export interface IRightAnswers {
  questionIndex: number;
  isCorrectAnswer: boolean;
  questionData: IAnswer;
  choosenAnswer?: number;
  isMarked: boolean;
}

export interface IMarkedQuizzes {
  questionIndex: number;
  questionData: IAnswer;
}

export interface IAvailableQuestionAnswers {
  value: number;
  label: string;
}
