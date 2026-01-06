import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const excelPath = path.join(process.cwd(), 'jcfoodmap_area_mapped.xlsx')
const csvPath = path.join(process.cwd(), 'jcfoodmap_area_mapped.csv')

const workbook = XLSX.readFile(excelPath)
const sheetName = workbook.SheetNames[0]
const worksheet = workbook.Sheets[sheetName]
const csv = XLSX.utils.sheet_to_csv(worksheet)

fs.writeFileSync(csvPath, csv, 'utf-8')
console.log(`Converted ${excelPath} to ${csvPath}`)
