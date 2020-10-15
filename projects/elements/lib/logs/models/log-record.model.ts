export interface LogRecord {
    date: string;
    description: string;
    request: {
      type: string;
      payload: string;
    };
    response: {
      type: string;
      status_code: number;
      payload: string;
    };
  }
