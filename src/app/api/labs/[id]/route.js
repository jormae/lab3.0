import { NextRequest, NextResponse } from "next/server";
import pool from '../../../config/db'

export async function GET( request, {params} ) {
    const id = params.id // leaveStatusId
    console.log(params.id)

        try {
            const db = await pool.getConnection()
            const query = 'select * from tbl_leave_status where leaveStatusId = ?'
            const [rows] = await db.execute(query, [id])
            db.release()
            
            return NextResponse.json(rows)
        } catch (err) {
            return NextResponse.json({
                error: err
            }, { status: 500 })
        }
      }
