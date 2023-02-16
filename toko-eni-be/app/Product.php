<?php

namespace App;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Product extends Model
{
    protected $fillable = [
        'name', 'price_sell', 'price_buy', 'stock'
    ];

    public static function boot()
    {
        parent::boot();

        static::created(function ($product) {
            Log::info('Product created', ['product' => $product]);
        });

        static::updated(function ($product) {
            Log::info('Product updated', ['product' => $product]);
        });

        static::deleted(function ($product) {
            Log::warning('Product deleted', ['product' => $product]);
        });
    }
}
