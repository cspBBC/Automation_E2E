import fs from 'fs';
import path from 'path';
import { FormField } from '../types/formField';

export async function readJSON(filePath: string): Promise<Record<string, any>> {
  // Accept full path from workspace root or relative path
  const resolvedPath = path.isAbsolute(filePath) 
    ? filePath 
    : path.resolve(process.cwd(), filePath);
  
  const rawData = fs.readFileSync(resolvedPath, 'utf-8');
  const data: Record<string, FormField> = JSON.parse(rawData);
  return data;
}

