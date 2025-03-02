export interface User {
  id: string;
  username: string;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  score: number;
  questions: number[];
  created_at?: Date;
} 