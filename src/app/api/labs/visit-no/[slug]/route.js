import { NextRequest, NextResponse } from "next/server";
import pool from '../../../../config/db'
import moment from "moment";

export async function GET( request, {params} ) {
    const visitno = params.slug // 2021-03-15
    const date = moment().format("YYYY/MM/DD")
    console.log('date = '+date)

        try {
            const db = await pool.getConnection()
            const query = `SELECT *, TIMESTAMPDIFF(YEAR, birth, ?) AS AGE, CONCAT(hnomoi, ' ม.', mumoi, ' ต.',subdistname, ' อ.', distname, ' จ.', provname,' ', postcodemoi) AS ADDRESS
            FROM visitlabchcyhembmsse v
            LEFT JOIN visit v2 ON v2.visitno = v.visitno
            LEFT JOIN tbl_lab_type lt ON lt.labTypeId = v2.labTypeId
            LEFT JOIN clabchcyhembmsse cl ON v.labcode = cl.labcode
            LEFT JOIN person p ON p.pid = v.pid
            LEFT JOIN _tmpprename_code c ON c.prenamecode = p.prename
            LEFT JOIN cright r ON p.rightcode = r.rightcode
            LEFT JOIN cprovince cp ON cp.provcode = p.provcodemoi
            LEFT JOIN cdistrict cd ON cd.provcode = cp.provcode AND cd.distcode = p.distcodemoi
            LEFT JOIN csubdistrict cs ON cd.provcode = cs.provcode AND cd.distcode = cs.distcode AND  cs.subdistcode = p.subdistcodemoi
            WHERE v.visitno = ?`
            const [rows] = await db.execute(query, [date, visitno])
            db.release()
            if(!rows){
              return NextResponse.json({
                error: err
              }, { status: 500 })
            }
            
            return NextResponse.json(rows)
        } catch (err) {
            return NextResponse.json({
                error: err
            }, { status: 500 })
        }
}

export async function PUT( req, {params} ) {

    const visitno = params.slug // 2021-03-15
    const body  = await req.json()
    const labTypeId  = body.labTypeId
    console.log('visitno = '+visitno);
    console.log('labTypeId = '+labTypeId);

    try {
        const db = await pool.getConnection()
        const query = 'UPDATE visit SET labTypeId = ? WHERE visitno = ?'
        const [result] = await db.execute(query, [labTypeId, visitno])
        console.log(result)
        db.release()        

        return NextResponse.json({status: 'success', message: "บันทึกข้อมูลประเภทแล็บสำเร็จ!" }, { status:200 })

    } catch (error) {
        return NextResponse.json({error: error}, { status: 500 })
    }
  }
