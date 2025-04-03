import { NextResponse } from 'next/server'
import pool from '../../../config/db'

export async function GET( request, {params} ) {
    const sex = params.slug 
    console.log(params.slug)
  try {
      const db = await pool.getConnection()
      const query = 'SELECT * FROM tbl_lab_type WHERE FIND_IN_SET(?, labSex) '
      const [rows] = await db.execute(query, [sex])
      db.release()
      
      return NextResponse.json(rows)
  } catch (error) {
      return NextResponse.json({
          error: error
      }, { status: 500 })
  }
}