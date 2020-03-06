/**
 * output.controller
 */

/* Node modules */
import * as fs from 'fs';

/* Third-party modules */
import {
  Controller,
  Get,
  HttpException, HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

/* Files */
import MediaService from '../services/media.service';

@Controller('/api/media/:id')
export default class OutputController {
  constructor(protected service: MediaService, protected logger: PinoLogger) {}

  @Get()
  async output(@Param('id') id, @Res() response) {
    this.logger.info({
      id,
    }, 'Outputting file');

    const media = await this.service.findOne(id);

    if (!media) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return fs.createReadStream(media.uploadedFileName)
      .on('error', (err) => {
        this.logger.error({
          err,
          media,
          id,
        }, 'Failed to load file');

        response.status(HttpStatus.NOT_FOUND)
          .send({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Not found',
          });
      })
      .pipe(response);
  }
}
