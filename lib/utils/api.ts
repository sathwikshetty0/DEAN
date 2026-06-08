/**
 * @fileoverview Utility module for api
 * Implements functionality related to the D-EAN platform's core logic layer.
 * Provides standardized response formats for API routes.
 */
import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Standard success response with optional message
 * @param data - Response data payload
 * @param status - HTTP status code (default: 200)
 * @param message - Optional success message
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
 * Standard error response with error details
 * @param error - Error message describing the failure
 * @param status - HTTP status code (default: 500)
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
