<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LinkController extends ApiController
{
    /**
     * Display a listing of the user's links.
     */
    public function index(Request $request)
    {
        $links = $request->user()->links()->latest()->get();

        return $this->successResponse(
            'Links retrieved successfully.',
            ['links' => $links]
        );
    }

    /**
     * Store a newly created link.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|min:3',
            'original_url' => 'required|url',
            'custom_alias' => 'nullable|min:3|unique:links,short_url|regex:/^[a-zA-Z0-9_-]+$/',
        ]);

        $shortUrl = $validated['custom_alias'] ?? $this->generateBase62Hash();
        $link = $request->user()->links()->create([
            'title' => $validated['title'],
            'original_url' => $validated['original_url'],
            'short_url' => $shortUrl,
        ]);

        return $this->successResponse('Link created successfully.', ['data' => $link], 201);
    }

    public function overview(Request $request)
    {
        $totalLinks = $request->user()->links()->count();
        $totalClicks = $request->user()->links()->sum('click_count');

        return $this->successResponse('Link overview retrieved successfully.', [
            'overview' => [
                'total_links' => $totalLinks,
                'total_clicks' => $totalClicks,
            ],
        ]);
    }

    /**
     * Display the specified link.
     */
    public function show(Request $request, string $id)
    {
        $link = $this->findUserLink($request->user(), $id);

        if (!$link) {
            return $this->errorResponse('Link not found.', [], 404);
        }

        return $this->successResponse('Link retrieved successfully.', ['link' => $link]);
    }

    /**
     * Update the specified link.
     */
    public function update(Request $request, string $id)
    {
        $link = $this->findUserLink($request->user(), $id);

        if (!$link) {
            return $this->errorResponse('Link not found.', [], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|min:3',
            'original_url' => 'nullable|url',
            'custom_alias' => 'nullable|min:3|unique:links,short_url,' . $id . '|regex:/^[a-zA-Z0-9_-]+$/',
        ]);

        $link->update([
            'title' => $validated['title'] ?? $link->title,
            'original_url' => $validated['original_url'] ?? $link->original_url,
            'short_url' => $validated['custom_alias'] ?? $link->short_url,
        ]);

        return $this->successResponse('Link updated successfully.', ['link' => $link]);
    }

    /**
     * Remove the specified link.
     */
    public function destroy(Request $request, string $id)
    {
        $link = $this->findUserLink($request->user(), $id);

        if (!$link) {
            return $this->errorResponse('Link not found.', [], 404);
        }

        $link->delete();
        return $this->successResponse('Link deleted successfully.');
    }

    /**
     * Redirect to the original URL for a given short URL.
     */
    public function redirect(string $shortUrl)
    {
        $link = Link::firstWhere('short_url', $shortUrl);

        if (!$link) {
            abort(404);
        }

        $link->increment('click_count');
        return redirect($link->original_url);
    }

    /**
     * Generate a random Base62 hash.
     */
    private function generateBase62Hash(int $length = 5): string
    {
        $charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        return collect(range(1, $length))
            ->map(fn() => $charset[random_int(0, strlen($charset) - 1)])
            ->implode('');
    }

    /**
     * Find a link owned by the authenticated user.
     */
    private function findUserLink($user, string $id): ?Link
    {
        return $user->links()->find($id);
    }
}
