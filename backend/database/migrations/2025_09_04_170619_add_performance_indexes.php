<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes for events table
        Schema::table('events', function (Blueprint $table) {
            $table->index('date', 'idx_events_date');
            $table->index('status', 'idx_events_status');
            $table->index(['status', 'date'], 'idx_events_status_date');
        });

        // Add indexes for users table
        Schema::table('users', function (Blueprint $table) {
            $table->index('role', 'idx_users_role');
            $table->index('major', 'idx_users_major');
            $table->index('email_verified_at', 'idx_users_email_verified');
            $table->index('created_at', 'idx_users_created_at');
        });

        // Add indexes for elections table
        if (Schema::hasTable('elections')) {
            Schema::table('elections', function (Blueprint $table) {
                $table->index('status', 'idx_elections_status');
                $table->index(['status', 'start_date', 'end_date'], 'idx_elections_active');
            });
        }

        // Add indexes for candidates table
        if (Schema::hasTable('candidates')) {
            Schema::table('candidates', function (Blueprint $table) {
                $table->index('election_id', 'idx_candidates_election_id');
            });
        }

        // Add indexes for votes table
        if (Schema::hasTable('votes')) {
            Schema::table('votes', function (Blueprint $table) {
                $table->index(['user_id', 'election_id'], 'idx_votes_user_election');
            });
        }

        // Add indexes for event_attendees pivot table
        if (Schema::hasTable('event_attendees')) {
            Schema::table('event_attendees', function (Blueprint $table) {
                $table->index('status', 'idx_event_attendees_status');
                $table->index(['event_id', 'status'], 'idx_event_attendees_event_status');
            });
        }

        // Add indexes for faqs table
        if (Schema::hasTable('faqs')) {
            Schema::table('faqs', function (Blueprint $table) {
                $table->index('is_published', 'idx_faqs_published');
                $table->index('order', 'idx_faqs_order');
            });
        }

        // Add indexes for user_questions table
        if (Schema::hasTable('user_questions')) {
            Schema::table('user_questions', function (Blueprint $table) {
                $table->index('status', 'idx_user_questions_status');
                $table->index('created_at', 'idx_user_questions_created_at');
            });
        }

        // Add indexes for banners table
        if (Schema::hasTable('banners')) {
            Schema::table('banners', function (Blueprint $table) {
                $table->index('is_active', 'idx_banners_active');
            });
        }

        // Add indexes for logos table
        if (Schema::hasTable('logos')) {
            Schema::table('logos', function (Blueprint $table) {
                $table->index('is_active', 'idx_logos_active');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop events indexes
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('idx_events_date');
            $table->dropIndex('idx_events_status');
            $table->dropIndex('idx_events_status_date');
        });

        // Drop users indexes
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_role');
            $table->dropIndex('idx_users_major');
            $table->dropIndex('idx_users_email_verified');
            $table->dropIndex('idx_users_created_at');
        });

        // Drop other table indexes
        if (Schema::hasTable('elections')) {
            Schema::table('elections', function (Blueprint $table) {
                $table->dropIndex('idx_elections_status');
                $table->dropIndex('idx_elections_active');
            });
        }

        if (Schema::hasTable('candidates')) {
            Schema::table('candidates', function (Blueprint $table) {
                $table->dropIndex('idx_candidates_election_id');
            });
        }

        if (Schema::hasTable('votes')) {
            Schema::table('votes', function (Blueprint $table) {
                $table->dropIndex('idx_votes_user_election');
            });
        }

        if (Schema::hasTable('event_attendees')) {
            Schema::table('event_attendees', function (Blueprint $table) {
                $table->dropIndex('idx_event_attendees_status');
                $table->dropIndex('idx_event_attendees_event_status');
            });
        }

        if (Schema::hasTable('faqs')) {
            Schema::table('faqs', function (Blueprint $table) {
                $table->dropIndex('idx_faqs_published');
                $table->dropIndex('idx_faqs_order');
            });
        }

        if (Schema::hasTable('user_questions')) {
            Schema::table('user_questions', function (Blueprint $table) {
                $table->dropIndex('idx_user_questions_status');
                $table->dropIndex('idx_user_questions_created_at');
            });
        }

        if (Schema::hasTable('banners')) {
            Schema::table('banners', function (Blueprint $table) {
                $table->dropIndex('idx_banners_active');
            });
        }

        if (Schema::hasTable('logos')) {
            Schema::table('logos', function (Blueprint $table) {
                $table->dropIndex('idx_logos_active');
            });
        }
    }
};