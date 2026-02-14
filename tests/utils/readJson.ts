import fs from 'fs';
import path from 'path';
import { FormField } from '../types/formField';

export async function readJSON(fileName: string): Promise<Record<string, FormField>> {
  const filePath = path.resolve(__dirname, `../data/${fileName}`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data: Record<string, FormField> = JSON.parse(rawData);
  return data;
}