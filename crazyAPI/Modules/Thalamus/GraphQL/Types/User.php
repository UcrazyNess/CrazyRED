<?php

namespace Modules\Thalamus\GraphQL\Types;

use Rebing\GraphQL\Support\Type as GraphQLType;
use GraphQL\Type\Definition\Type;

class User extends GraphQLType
{
    protected $attributes = [
        'name' => 'User',
        'description' => 'A description of User',
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The unique ID of the user',
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'User full name',
            ],
            'email' => [
                'type' => Type::string(),
                'description' => 'User email address',
            ],
            // فیلد محاسباتی: مثلاً نشان دادن زمان عضویت به فرمت خوانا
            'joined_at' => [
                'type' => Type::string(),
                'selectable' => false, // چون توی دیتابیس نیست
                'resolve' => function ($model) {
                    return $model->created_at->diffForHumans();
                }
            ],
        ];
    }
}
