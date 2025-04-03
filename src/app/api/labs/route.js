import { NextResponse } from 'next/server'
import pool from '../../config/db'

export async function GET() {
  try {
      const db = await pool.getConnection()
      const query = 'select * from tbl_leave_status'
      const [rows] = await db.execute(query)
      db.release()
      
      return NextResponse.json(rows)
  } catch (error) {
      return NextResponse.json({
          error: error
      }, { status: 500 })
  }
}