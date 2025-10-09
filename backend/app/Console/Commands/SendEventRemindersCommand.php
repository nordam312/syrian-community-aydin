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
        $this->info('Starting event reminders check...');
        Log::info('Command: Starting event reminders check');

        // إرسال تذكيرات اليوم الواحد
        $this->sendOneDayReminders();

        // إرسال تذكيرات الساعتين
        $this->sendTwoHourReminders();

        $this->info('Event reminders check completed!');
        Log::info('Command: Event reminders check completed');
    }

    private function sendOneDayReminders()
    {
        $this->info('Checking for 1-day reminders...');
        Log::info('Scheduler: Running one_day reminders');

        $startTime = now()->addHours(23);
        $endTime = now()->addHours(25);

        $events = Event::where('status', 'active')
            ->whereBetween('date', [$startTime, $endTime])
            ->where('one_day_reminder_sent', false)
            ->get();

        $this->info("Found {$events->count()} events needing 1-day reminders");
        Log::info("Scheduler: Found {$events->count()} events needing one_day reminders");

        foreach ($events as $event) {
            $attendees = $event->attendees()
                ->wherePivot('status', 'confirmed')
                ->whereNotNull('email')
                ->get();

            $this->info("  Event '{$event->title}' has {$attendees->count()} attendees");

            foreach ($attendees as $attendee) {
                try {
                    Mail::to($attendee->email)->send(
                        new EventReminderMail($event, 'one_day')
                    );
                    $this->info("    ✓ Sent to {$attendee->email}");
                    Log::info("Sent one_day reminder to {$attendee->email} for event '{$event->title}'");
                } catch (\Exception $e) {
                    $this->error("    ✗ Failed to send to {$attendee->email}: {$e->getMessage()}");
                    Log::error("Failed to send reminder to {$attendee->email}: {$e->getMessage()}");
                }
            }

            $event->update(['one_day_reminder_sent' => true]);
        }
    }

    private function sendTwoHourReminders()
    {
        $this->info('Checking for 2-hour reminders...');
        Log::info('Scheduler: Running two_hour reminders');

        $startTime = now()->addMinutes(90);
        $endTime = now()->addMinutes(150);

        $events = Event::where('status', 'active')
            ->whereBetween('date', [$startTime, $endTime])
            ->where('two_hour_reminder_sent', false)
            ->get();

        $this->info("Found {$events->count()} events needing 2-hour reminders");
        Log::info("Scheduler: Found {$events->count()} events needing two_hour reminders");

        foreach ($events as $event) {
            $attendees = $event->attendees()
                ->wherePivot('status', 'confirmed')
                ->whereNotNull('email')
                ->get();

            $this->info("  Event '{$event->title}' has {$attendees->count()} attendees");

            foreach ($attendees as $attendee) {
                try {
                    Mail::to($attendee->email)->send(
                        new EventReminderMail($event, 'two_hour')
                    );
                    $this->info("    ✓ Sent to {$attendee->email}");
                    Log::info("Sent two_hour reminder to {$attendee->email} for event '{$event->title}'");
                } catch (\Exception $e) {
                    $this->error("    ✗ Failed to send to {$attendee->email}: {$e->getMessage()}");
                    Log::error("Failed to send reminder to {$attendee->email}: {$e->getMessage()}");
                }
            }

            $event->update(['two_hour_reminder_sent' => true]);
        }
    }
}
