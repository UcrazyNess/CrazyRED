<?php

namespace Modules\Thalamus\GraphQL\Queries;

use GraphQL\Type\Definition\Type;
use Modules\Thalamus\Models\User;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class GetUsers extends Query
{
    protected $attributes = [
        'name' => 'GetUsers',
    ];

    public function type(): Type
    {
        // مثلاً: Type::listOf(GraphQL::type('Target'))
        return Type::listOf(GraphQL::string('user'));
    }

    public function args(): array
    {
        return [
            // پارامترهای ورودی مثل id برای فیلتر کردن
        ];
    }

    public function resolve($root, $args)
    {
        // منطق دریافت داده از دیتابیس یا مدل‌های ماژول
        return User::all();
    }
}
