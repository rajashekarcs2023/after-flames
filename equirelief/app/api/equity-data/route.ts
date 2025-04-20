import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    // Get the path to the JSON file
    const filePath = path.join(process.cwd(), "public/data/equity_data.json")

    // Read the file
    const fileContents = await fs.readFile(filePath, "utf8")

    // Parse the JSON
    const data = JSON.parse(fileContents)

    // Return the data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading equity data:", error)
    return NextResponse.json({ error: "Failed to load equity data" }, { status: 500 })
  }
}
