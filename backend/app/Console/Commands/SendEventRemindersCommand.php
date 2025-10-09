<?php

namespace App\Console\Commands;

use App\Mail\EventReminderMail;
use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEventRemindersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send event reminders (1 day and 2 hours before)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // إرسال تذكيرات اليوم الواحد
        $this->sendOneDayReminders();

        // إرسال تذكيرات الساعتين
        $this->sendTwoHourReminders();
    }

    private function sendOneDayReminders()
    {
        $startTime = now()->addHours(23);
        $endTime = now()->addHours(25);

        $events = Event::where('status', 'active')
            ->whereBetween('date', [$startTime, $endTime])
            ->where('one_day_reminder_sent', false)
            ->get();

        if ($events->isEmpty()) {
            return;
        }

        foreach ($events as $event) {
            $attendees = $event->attendees()
                ->wherePivot('status', 'confirmed')
                ->whereNotNull('email')
                ->get();

            foreach ($attendees as $attendee) {
                try {
                    Mail::to($attendee->email)->send(
                        new EventReminderMail($event, 'one_day')
                    );
                } catch (\Exception $e) {
                    Log::error("Failed to send one_day reminder to {$attendee->email} for event '{$event->title}': {$e->getMessage()}");
                }
            }

            $event->update(['one_day_reminder_sent' => true]);
        }
    }

    private function sendTwoHourReminders()
    {
        $startTime = now()->addMinutes(90);
        $endTime = now()->addMinutes(150);

        $events = Event::where('status', 'active')
            ->whereBetween('date', [$startTime, $endTime])
            ->where('two_hour_reminder_sent', false)
            ->get();

        if ($events->isEmpty()) {
            return;
        }

        foreach ($events as $event) {
            $attendees = $event->attendees()
                ->wherePivot('status', 'confirmed')
                ->whereNotNull('email')
                ->get();

            foreach ($attendees as $attendee) {
                try {
                    Mail::to($attendee->email)->send(
                        new EventReminderMail($event, 'two_hour')
                    );
                } catch (\Exception $e) {
                    Log::error("Failed to send two_hour reminder to {$attendee->email} for event '{$event->title}': {$e->getMessage()}");
                }
            }

            $event->update(['two_hour_reminder_sent' => true]);
        }
    }
}
