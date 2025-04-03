import { NextRequest, NextResponse } from "next/server";
import pool from '../../../config/db'

export async function GET( request, {params} ) {
    const visitno = params.slug // 2021-03-15
    console.log(params.slug)

        try {
            const db = await pool.getConnection()
            const query = `SELECT *
            FROM visitlabchcyhembmsse v
            LEFT JOIN clabchcyhembmsse c ON l.labcode = c.labcode
            LEFT JOIN person p ON p.pid = v.pid
            WHERE visitno = ?`
            const [rows] = await db.execute(query, [visitno])
            db.release()
            
            return NextResponse.json(rows)
        } catch (err) {
            return NextResponse.json({
                error: err
            }, { status: 500 })
        }
}
