import { NextResponse, NextRequest } from 'next/server'
import pool from '../../config/db'

const jwt = require("jsonwebtoken");
const secret = "lab2.0";

export async function  GET() {

  try {
      const db = await pool.getConnection()
      const query = 'SELECT * FROM user WHERE username <> ""'
      const [rows] = await db.execute(query)
      db.release()     
      return NextResponse.json(rows)
  } catch (error) {
      return NextResponse.json({
          error: error
      }, { status: 500 })
  }
}

export async function PUT(req) {

    const { username, fullname, telephone, email, officerposition } = await req.json()

    try {
        const db = await pool.getConnection()
        const query = 'UPDATE user SET fullname = ?, telephone = ?, email = ?, officerposition = ? WHERE username = ?'
        const [result] = await db.execute(query, [fullname, telephone, email, officerposition, username])
        console.log(result)
        console.log(result.affectedRows)
        db.release()     
        if(result.affectedRows == "1") {
            return NextResponse.json({status: 'success', message: "บันทึกข้อมูลเจ้าหน้าที่สำเร็จ!" }, { status:200 })
        }
        return NextResponse.json({status: 'error', message: error.message }, { status:500 })

    } catch (error) {
        return NextResponse.json({error: error}, { status: 500 })
    }
  }

  export async function POST(req) {

    const { username, password } = await req.json()

    try {
        const db = await pool.getConnection()
        const query = 'SELECT  * FROM user WHERE username = ? AND password = ? '
        const [user] = await db.execute(query, [username, password])
        db.release()        
            if (user.length == 0) {
                return NextResponse.json({status: 'error', message: "ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"}, { status:400 })
            }
            else{
                if (password == user[0].password) {
                    let token = jwt.sign({ 
                        username: username,
                        fullname:user[0].fullname
                    }, secret, {
                        expiresIn: "3h",
                    });
                    return NextResponse.json({status: 'success', message: "เข้าสู่ระบบสำเร็จ!", username: username, fullname: user[0].fullname, token:token}, { status:200 })
                }else{
                    return NextResponse.json({status: 'error', message: "ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง!!", username: username, fullname: user[0].fullname, }, { status:400 })
                }
            }
        // })

    } catch (error) {
        return NextResponse.json({error: error}, { status: 500 })
    }
  }
  