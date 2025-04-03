import { NextRequest, NextResponse } from "next/server";
import pool from '../../../../config/db'

export async function GET( request, {params} ) {
    const date = params.slug // 2021-03-15
    console.log(params.slug)

        try {
            const db = await pool.getConnection()
            const query = `SELECT  CONCAT(prenamelong, p.fname,' ',p.lname) AS patientName, TIMESTAMPDIFF(YEAR, birth,?) AS AGE, CONCAT(hnomoi, ' ม.', mumoi, ' ต.',subdistname, ' อ.', distname, ' จ.', provname,' ', postcodemoi) AS ADDRESS,
            li.*, GROUP_CONCAT(DISTINCT labItemName ORDER BY labItemName SEPARATOR ', [_] ') AS labItemNames, labTypeName, p.pid, p.idcard, rightname, sex, v.visitno
                        FROM visitlabchcyhembmsse l
                        LEFT JOIN visit v ON l.visitno = v.visitno
                        LEFT JOIN tbl_lab_type lt ON lt.labTypeId = v.labTypeId
                        LEFT JOIN tbl_lab_item li ON li.labTypeId = lt.labTypeId
                        LEFT JOIN person p ON v.pid = p.pid
                        LEFT JOIN _tmpprename_code c ON p.prename = c.prenamecode					
                        LEFT JOIN cright r ON v.rightcode = r.rightcode
                        LEFT JOIN cprovince cp ON cp.provcode = p.provcodemoi
                        LEFT JOIN cdistrict cd ON cd.provcode = cp.provcode AND cd.distcode = p.distcodemoi
                        LEFT JOIN csubdistrict cs ON cd.provcode = cs.provcode AND cd.distcode = cs.distcode AND  cs.subdistcode = p.subdistcodemoi 
                        WHERE visitdate = ?
                        GROUP BY timestart DESC
                        ORDER BY labTypeName DESC`
            const [rows] = await db.execute(query, [date, date])
            db.release()
            // console.log('result = ', JSON.stringify(rows))            
            return NextResponse.json(rows)
        } catch (err) {
            return NextResponse.json({
                error: err
            }, { status: 500 })
        }
      }
