export interface User {
  id: string;
  username: string;
}

export interface Challenge {
  id: string;
  challenger: string;
  score: number;
  questions: number[];
} 