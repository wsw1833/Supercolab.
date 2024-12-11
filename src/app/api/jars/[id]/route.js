import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const id = parseInt(req.url.split("/")[5]);

    const db = await connectDB();
    const collection = db.collection("hedara");

    const data = await collection.find({ id }).toArray();

    return NextResponse.json({ data });
}