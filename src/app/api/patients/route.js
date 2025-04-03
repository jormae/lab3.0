import { NextResponse } from 'next/server'
import pool from '../../config/db'

export async function GET() {
  try {
      const db = await pool.getConnection()
      const query = 'SELECT * FROM tbl_lab_type'
      const [rows] = await db.execute(query)
      db.release()
      
      return NextResponse.json(rows)
  } catch (error) {
      return NextResponse.json({
          error: error
      }, { status: 500 })
  }
}