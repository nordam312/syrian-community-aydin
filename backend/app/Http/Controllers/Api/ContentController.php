<?php

namespace App\Http\Controllers\Api;

use App\Models\Content;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContentController extends Controller
{
    public function index()
    {
        $content = Content::getContent();
        return response()->json($content);
    }

    public function update(Request $request)
    {
        $request->validate([
            'home_title' => 'nullable|string|max:255',
            'home_description' => 'nullable|string',
            'about_title' => 'nullable|string|max:255',
            'about_content' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'contact_address' => 'nullable|string|max:255',
            'social_facebook' => 'nullable|url',
            'social_instagram' => 'nullable|url',
            'social_telegram' => 'nullable|url'
        ]);

        $content = Content::getContent();
        $content->updateContent($request->all());

        return response()->json([
            'message' => 'تم تحديث المحتوى بنجاح',
            'content' => $content
        ]);
    }

    public function updateHome(Request $request)
    {
        $request->validate([
            'home_title' => 'nullable|string|max:255',
            'home_description' => 'nullable|string'
        ]);

        $content = Content::getContent();
        $content->updateContent($request->only(['home_title', 'home_description']));

        return response()->json([
            'message' => 'تم تحديث محتوى الصفحة الرئيسية بنجاح',
            'content' => $content
        ]);
    }

    public function updateAbout(Request $request)
    {
        $request->validate([
            'about_title' => 'nullable|string|max:255',
            'about_content' => 'nullable|string'
        ]);

        $content = Content::getContent();
        $content->updateContent($request->only(['about_title', 'about_content']));

        return response()->json([
            'message' => 'تم تحديث محتوى صفحة من نحن بنجاح',
            'content' => $content
        ]);
    }

    public function updateContact(Request $request)
    {
        $request->validate([
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'contact_address' => 'nullable|string|max:255'
        ]);

        $content = Content::getContent();
        $content->updateContent($request->only(['contact_email', 'contact_phone', 'contact_address']));

        return response()->json([
            'message' => 'تم تحديث معلومات التواصل بنجاح',
            'content' => $content
        ]);
    }

    public function updateSocial(Request $request)
    {
        $request->validate([
            'social_facebook' => 'nullable|url',
            'social_instagram' => 'nullable|url',
            'social_telegram' => 'nullable|url'
        ]);

        $content = Content::getContent();
        $content->updateContent($request->only(['social_facebook', 'social_instagram', 'social_telegram']));

        return response()->json([
            'message' => 'تم تحديث روابط التواصل الاجتماعي بنجاح',
            'content' => $content
        ]);
    }
}