import { NextResponse, NextRequest } from 'next/server'
import pool from '../../../config/db'

const jwt = require("jsonwebtoken");
const secret = "lab2.0";

export async function  GET( request, {params} ) {
    const username = params.username // 2021-03-15
    console.log('get username = '+params.username)

  try {
      const db = await pool.getConnection()
      const query = 'SELECT * FROM user u  WHERE u.username = ?'
      const [rows] = await db.execute(query, [username])
      console.log(query)
      db.release()     
      return NextResponse.json(rows)
  } catch (error) {
      return NextResponse.json({
          error: error
      }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
    const username = params.username;
    const { fullname, telephone, email, officerposition } = await request.json();

    try {
        const db = await pool.getConnection();
        const query = 'UPDATE user SET fullname = ?, telephone = ?, email = ?, officerposition = ? WHERE username = ?';
        const [result] = await db.execute(query, [fullname, telephone, email, officerposition, username]);
        console.log("Update Result: ", result);

        db.release();

        if (result.affectedRows === 1) {
            return NextResponse.json({ status: 'success', message: 'แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว' }, { status: 200 });
        } else if (result.affectedRows === 0) {
             return NextResponse.json({ status: 'error', message: 'ไม่พบผู้ใช้ หรือไม่มีการแก้ไขข้อมูล' }, { status: 404 }); // Changed to 404 for resource not found / no updates
        } else {
            return NextResponse.json({ status: 'error', message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' }, { status: 500 }); // Generic error
        }
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ status: 'error', message: error.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' }, { status: 500 });
    }
}
