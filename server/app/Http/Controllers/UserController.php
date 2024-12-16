<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends ApiController
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        $users = User::all();

        return $this->successResponse(
            'Users retrieved successfully.',
            ['data' => ['users' => $users]]
        );
    }

    /**
     * Display the currently authenticated user.
     */
    public function current(Request $request)
    {
        return $this->successResponse('User retrieved successfully.', ['user' => $request->user()]);
    }

    /**
     * Display the specified user by ID.
     */
    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found.', [], 404);
        }

        return $this->successResponse('User retrieved successfully.', ['data' => $user]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|min:3',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'avatar' => 'nullable',
        ]);

        $user->update($validated);
        return $this->successResponse('User updated successfully.', ['user' => $user]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $user->delete();
        return $this->successResponse('User deleted successfully.');
    }
}
