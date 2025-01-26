export interface ResponseModel<T> {
    code: number;
    status: string;
    message: string;
    data: T;  // Aquí 'T' es el tipo genérico que representará la data
  }
  