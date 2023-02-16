<?php

namespace App\Http\Controllers;
use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $product = Product::create($request->all());

        Log::info('Product created: ' . $product->name);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->all());

        Log::info('Product updated: ' . $product->name);

        return response()->json($product, 200);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        Log::info('Product deleted: ' . $product->name);

        return response()->json(null, 204);
    }
}
