/**
 * media.controller
 */

/* Node modules */
import { promises as fs } from 'fs';

/* Third-party modules */
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import {
  Controller,
  Param,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';

/* Files */
import Media from '../entities/media.entity';
import MediaService from '../services/media.service';

@Crud({
  model: {
    type: Media,
  },
  routes: {
    only: [
      'createOneBase',
      'deleteOneBase',
      'getManyBase',
      'replaceOneBase',
    ],
  },
  query: {
    join: {
      user: {
        eager: true,
      },
    },
  },
})
@UseGuards(AuthGuard('jwt'))
@Controller('/api/media')
export default class MediaController implements CrudController<Media> {
  constructor(
    public service: MediaService,
    protected logger: PinoLogger,
  ) {}

  get base() : CrudController<Media> {
    return this;
  }

  @Override('createOneBase')
  @UseInterceptors(FileInterceptor('file'))
  createOne(@Request() req, @ParsedRequest() parsedReq, @UploadedFile() file) {
    const dto = new Media();
    dto.originalFileName = file.originalname;
    dto.uploadedFileName = file.path;
    dto.mimeType = file.mimetype;
    dto.size = file.size;
    dto.user = req.user;

    this.logger.info({
      dto,
    }, 'Uploading new file');

    return this.base.createOneBase(parsedReq, dto);
  }

  @Override('deleteOneBase')
  async deleteOne(@ParsedRequest() req, @Param('id') id: string) {
    try {
      const item = await this.service.findOne(id);

      if (item) {
        /* Delete the uploaded file */
        await fs.unlink(item.uploadedFileName);
      }
    } catch (err) {
      this.logger.error({
        err,
        id,
      }, 'Failed to delete file');
    }

    return this.base.deleteOneBase(req);
  }
}
