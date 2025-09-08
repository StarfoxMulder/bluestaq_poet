export interface Poem {
  title: string;
  author: string;
  lines: string[];
  linecount: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  endpoint: string;
}
