<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token;

    public function __construct(User $user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function build()
    {
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password?token=' . $this->token . '&email=' . $this->user->email;
        
        return $this->subject('استعادة كلمة المرور - المجتمع السوري في أيدن')
                    ->view('password-reset')
                    ->with([
                        'user' => $this->user,
                        'resetUrl' => $resetUrl,
                    ]);
    }
}