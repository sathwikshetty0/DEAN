import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Standard success response
 */
export const apiSuccess = <T>(data: T, status = 200, message?: string) => {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
};

/**
 * Standard error response
 */
export const apiError = (error: string, status = 500) => {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
};
