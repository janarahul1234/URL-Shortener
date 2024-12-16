<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends ApiController
{
    /**
     * Handle user login.
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $user = User::firstWhere('email', $credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return $this->errorResponse('Invalid email or password.', [], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse('Login successful.', [
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Handle user registration.
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validated());
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse('User registered successfully.', [
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function redirectToAuth()
    {
        return [
            'url' => Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl(),
        ];
    }

    /**
     * Handle Google authentication callback.
     */
    public function handleAuthCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::firstOrCreate(
                ['auth_id' => $googleUser->id],
                [
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar,
                    'auth_id' => $googleUser->id,
                ]
            );

            $token = $user->createToken('auth_token')->plainTextToken;
            $message = $user->wasRecentlyCreated
            ? 'User registered successfully.'
            : 'User logged in successfully.';

            return $this->successResponse($message, [
                'user' => $user,
                'token' => $token,
            ], $user->wasRecentlyCreated ? 201 : 200);
        } catch (ClientException $e) {
            return $this->errorResponse('Invalid credentials provided.', [], 422);
        }
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse('Logout successful.', [], 200);
    }
}
