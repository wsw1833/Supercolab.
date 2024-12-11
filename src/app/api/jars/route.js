import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const db = await connectDB();

    const collection = db.collection("hedara");

    const data = await collection.find({}).toArray();

    return NextResponse.json({ data });
}

export async function POST(req) {
    const newJar = await req.json();

    const db = await connectDB();
    const collection = db.collection("hedara");;

    await collection.insertOne(newJar);

    return new NextResponse(newJar, { status: 200 });
}
