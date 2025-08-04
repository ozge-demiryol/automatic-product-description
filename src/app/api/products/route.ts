// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/app/api/services/productService";

const productService = new ProductService();

export async function GET(request: NextRequest) {
  const products = await productService.getAllProducts();
  console.log("Dönen ürün sayısı:", products.length);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const created = await productService.createProduct(data);
  return NextResponse.json(created, { status: 201 });
}
