
export interface ApiResponseBase<T> {
    success: boolean;
    data?: T;
    errorMessage?: string;
}

