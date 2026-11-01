export type ApiResponse<TData = unknown> =
  | {
      success: true;
      message: string;
      data?: TData;
    }
  | {
      success: false;
      message: string;
      errors?: string[];
    };
