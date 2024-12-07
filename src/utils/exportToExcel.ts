import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
        return current ? current[key] : undefined;
    }, obj);
}

export interface ExcelColumn {
    field: string;
    header: string;
    width?: number;
    formatter?: (value: any) => string | number;
}

export async function exportToExcel<T extends Record<string, any>>(
    data: T[],
    columns: ExcelColumn[],
    filename: string = 'export.xlsx',
): Promise<void> {
    if (data.length === 0) {
        throw new Error('Data array is empty');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const headers = columns.map(col => col.header);
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' },
        };
        cell.font = {
            bold: true,
            size: 12,
        };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    data.forEach((item) => {
        const rowData = columns.map(col => {
            const value = getNestedValue(item, col.field);
            return col.formatter ? col.formatter(value) : (value ?? '');
        });

        const dataRow = worksheet.addRow(rowData);

        dataRow.eachCell((cell) => {
            cell.alignment = {
                vertical: 'middle',
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    columns.forEach((col, index) => {
        const column = worksheet.getColumn(index + 1);
        if (col.width) {
            column.width = col.width;
        } else {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
        }
    });

    worksheet.eachRow((row) => {
        row.height = 25;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
}