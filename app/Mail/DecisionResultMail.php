<?php

namespace App\Mail;

use App\Models\DecisionSession;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DecisionResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public DecisionSession $decisionSession) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your ALLPACK Packaging Decision Result',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.decision-result',
            with: [
                'visitor' => $this->decisionSession->visitor,
                'businessCase' => $this->decisionSession->businessCase,
                'option' => $this->decisionSession->packagingOption,
                'session' => $this->decisionSession,
            ],
        );
    }
}
