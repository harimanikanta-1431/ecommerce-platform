import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('api/uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UploadsController {
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_request, file, callback) => {
          const safeName = file.originalname
            .replace(extname(file.originalname), '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
          callback(null, `${safeName}-${Date.now()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'));
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
