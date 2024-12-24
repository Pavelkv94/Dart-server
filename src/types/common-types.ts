import { ResultStatus } from "./enums";

export type OutputDataWithPagination<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type ResultObject<T> = {
  status: ResultStatus;
  errorMessage?: string;
  data: T;
};

export type SortDirection = "asc" | "desc";
