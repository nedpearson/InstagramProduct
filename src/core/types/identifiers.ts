// Strong ID typing to prevent passing Briefs into Job functions
export type BriefId = string & { readonly __brand: unique symbol };
export type JobId = string & { readonly __brand: unique symbol };
export type WorkspaceId = string & { readonly __brand: unique symbol };
export type TraceId = string & { readonly __brand: unique symbol };
