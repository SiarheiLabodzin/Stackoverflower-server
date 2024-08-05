export interface CreateAnswerInterface {
  email: string;
  text: string;
  id: number;
}

export interface UpdateUserAnswerInterface {
  email: string;
  text: string;
  id: number;
}

export interface UpdateAnswerInterface {
  text: string;
  id: number;
}

export interface DeleteUserAnswerInterface {
  email: string;
  id: number;
}
