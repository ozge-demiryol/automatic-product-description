import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/app/api/services/productService";

const productService = new ProductService();

export async function GET( request: NextRequest, { params }: { params: Promise<{ id: string }> }) 
{
  const { id } = await params;

  const product = await productService.getProductById(id);

  if (!product) {
    return NextResponse.json(
      { message: `Product with id '${id}' not found` },
      { status: 404 }
    );
  }
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();

  const updated = await productService.updateProduct(id, data);

  if (!updated) {
    return NextResponse.json(
      { message: `Product with id '${id}' not found or no changes applied` },
      { status: 404 }
    );
  }
  return NextResponse.json({
    message: `Product with id '${id}' updated successfully`,
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await productService.deleteProduct(id);

  if (!deleted) {
    return NextResponse.json(
      { message: `Product with id '${id}' not found` },
      { status: 404 }
    );
  }
  return NextResponse.json({
    message: `Product with id '${id}' deleted successfully`,
  });
}
