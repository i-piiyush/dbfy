export type response<TData = unknown> =
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
