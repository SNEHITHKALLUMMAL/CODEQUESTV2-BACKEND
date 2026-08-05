import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static ok<T>(res: Response, data: T, message = "OK", statusCode = 200): Response {
    return res.status(statusCode).json({ success: true, message, data });
  }
  static created<T>(res: Response, data: T, message = "Created"): Response {
    return res.status(201).json({ success: true, message, data });
  }
  static noContent(res: Response): Response {
    return res.status(204).send();
  }
  static paginated<T>(res: Response, data: T[], meta: PaginationMeta, message = "OK"): Response {
    return res.status(200).json({ success: true, message, data, meta });
  }
}
