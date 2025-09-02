<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Faq;
use App\Http\Controllers\Controller;


class FAQController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FAQ::where('is_published', true);
        
        // التصفية حسب الفئة
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        
        // البحث
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                ->orWhere('answer', 'like', "%{$search}%");
            });
        }
        
        $faqs = $query->orderBy('order')->orderBy('created_at')->get();
        
        return response()->json($faqs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'nullable|string',
            'category' => 'required|string|max:50'
        ]);

        $faq = FAQ::create($validated);

        return response()->json($faq, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        return response()->json($faq);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'sometimes|required|string|max:500',
            'answer' => 'nullable|string',
            'category' => 'sometimes|required|string|max:50',
            'is_published' => 'sometimes|boolean'
        ]);

        $faq->update($validated);

        return response()->json($faq);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();

        return response()->json(null,204);
    }
}
