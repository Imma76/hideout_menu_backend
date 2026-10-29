import {
  BadRequestException,
  Controller,
  Post,
  ServiceUnavailableException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { BasicAuthGuard } from '../auth/basic-auth.guard';

const MAX_BYTES = 8 * 1024 * 1024;

@Controller('uploads')
@UseGuards(BasicAuthGuard)
export class UploadsController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_BYTES },
    }),
  )
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    // The SDK reads CLOUDINARY_URL from the environment on its own.
    if (!process.env.CLOUDINARY_URL) {
      throw new ServiceUnavailableException(
        "Photo uploads aren't set up yet. Add CLOUDINARY_URL to the backend's config vars.",
      );
    }
    if (!file) throw new BadRequestException('Choose an image to upload.');
    if (!/^image\/(png|jpe?g|webp|avif)$/.test(file.mimetype)) {
      throw new BadRequestException('Use a PNG, JPG, WebP or AVIF image.');
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'hideout/menu',
            resource_type: 'image',
            transformation: [{ width: 1400, height: 1400, crop: 'limit' }],
          },
          (err, res) => (err || !res ? reject(err) : resolve(res)),
        )
        .end(file.buffer);
    });

    // Delivered as WebP/AVIF at the size the menu actually shows.
    const url = cloudinary.url(result.public_id, {
      secure: true,
      version: result.version,
      transformation: [
        { height: 700, crop: 'limit' },
        { fetch_format: 'auto', quality: 'auto' },
      ],
    });
    return { url };
  }
}
