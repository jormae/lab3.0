import { NextResponse, NextRequest } from 'next/server'
import pool from '../../config/db'

export async function  GET(req) {

  try {
      const db = await pool.getConnection()
      const query = 'SELECT * FROM tbl_org  WHERE orgId = 1'
      const [rows] = await db.execute(query)
      console.log(query)
      db.release()     
      return NextResponse.json(rows)
  } catch (error) {
      return NextResponse.json({
          error: error
      }, { status: 500 })
  }
}

export async function PUT(req) {

    const { orgName, orgShortName, orgAddress, orgDocNo } = await req.json()

    try {
        const db = await pool.getConnection()
        const query = 'UPDATE tbl_org SET orgName = ?, orgShortName = ?, orgAddress = ?, orgDocNo = ? WHERE orgId = 1'
        const [result] = await db.execute(query, [orgName, orgShortName, orgAddress, orgDocNo])
        console.log(result)
        console.log(result.affectedRows)
        db.release()     
        if(result.affectedRows == "1") {
            return NextResponse.json({status: 'success', message: "บันทึกข้อมูลหน่วยงานสำเร็จ!" }, { status:200 })
        }
        return NextResponse.json({status: 'error', message: error.message }, { status:500 })

    } catch (error) {
        return NextResponse.json({error: error}, { status: 500 })
    }
  }

  