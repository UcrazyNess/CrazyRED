<?php

return [
    // کوئری‌ها (برای خواندن داده‌ها)
    'query' => [
        'allUsers' => \Modules\Thalamus\GraphQL\Queries\GetUsers::class,
    ],

    // میوتیشن‌ها (برای تغییر داده‌ها - فعلاً خالی)
    'mutation' => [
        // 'registerUser' => \Modules\Thalamus\GraphQL\Mutations\RegisterUser::class,
    ],
];
