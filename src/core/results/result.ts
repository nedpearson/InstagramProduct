export interface ApiResult<T> { success: boolean; data?: T; error?: DomainError; }
export class DomainError extends Error { constructor(public code: string, message: string) { super(message); } }
