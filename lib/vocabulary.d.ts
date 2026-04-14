declare module '*.json' {
  const value: {
    id: string;
    word: string;
    definition: string;
    example: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }[];
  export default value;
}