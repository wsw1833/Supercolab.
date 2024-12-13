import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const db = await connectDB();

  const collection = db.collection('hedera');

  const data = await collection.find({}).toArray();

  return NextResponse.json({ data });
}
