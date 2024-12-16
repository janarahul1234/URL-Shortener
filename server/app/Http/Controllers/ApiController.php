<?php

namespace App\Http\Controllers;

class ApiController extends Controller
{
    /**
     * Send a success response.
     *
     * @param string $message
     * @param array $data
     * @param int $code
     * @return json
     */
    protected function successResponse(string $message, $data = [], int $code = 200)
    {

        return response()->json(array_merge([
            'status' => 'success',
            'code' => $code,
            'message' => $message,
        ], $data), $code);
    }

    /**
     * Send an error response.
     *
     * @param string $message
     * @param array $errors
     * @param int $code
     * @return json
     */
    protected function errorResponse(string $message, array $errors = [], int $code = 500)
    {
        return response()->json([
            'status' => 'error',
            'code' => $code,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
