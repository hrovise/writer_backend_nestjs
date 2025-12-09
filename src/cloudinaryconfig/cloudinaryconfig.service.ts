import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class CloudinaryConfigService  {

  constructor( private readonly configService: ConfigService){
    cloudinary.config({
       cloud_name: this.configService.getOrThrow<string>('CLOUDY_NAME'),
      api_key: this.configService.getOrThrow<string>('API_KEY_CLOUD'),
      api_secret: this.configService.getOrThrow<string>('API_SECRET_CLOUD'),
    });
  }
 
    async uploadImageBuffer(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
            folder: 'novels', 
            public_id: file.originalname.split('.')[0] 
        }, 
        (error, result) => {
          if (error||!result) return reject(error);
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  

}
