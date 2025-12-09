import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import AdmZip from 'adm-zip';
import { DOCX, TXT, UNKNOWN } from 'src/shared/constExpressions/expressions';
import { isText } from 'istextorbinary';

@Injectable()
export class FileValidatorService {
  static async isTxt(buffer: Buffer): Promise<boolean | null> {
    return isText(null, buffer);
  }

  static async isDocx(buffer: Buffer): Promise<boolean> {
    const signature = buffer?.slice(0, 4).toString('hex');
    if (signature !== '504b0304') return false;

    const zip = new AdmZip(buffer);
    const entries = zip.getEntries().map((e) => e.entryName);

    return entries.includes('word/document.xml');
  }

  static async validateFile(buffer: Buffer): Promise<string> {
    if (await this.isTxt(buffer)) return TXT;
    if (await this.isDocx(buffer)) return DOCX;
    return UNKNOWN;
  }
}
