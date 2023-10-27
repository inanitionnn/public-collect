import { Injectable, Logger } from '@nestjs/common';
import * as GoogleImages from 'google-images';
import { MediaType } from 'src/media/types';
import { ImagesParseDto, ImagesResponseDto } from '../dto';

type ImageType = {
  url: string;
  type: string;
  width: number;
  height: number;
  size: number;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
};

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  // private readonly error = new MyError();

  private async loadImages(
    query: string,
    count: number,
    maxPage: number,
    client: any,
  ): Promise<string[]> {
    this.logger.log('loadImages');
    let imageCount = 0;
    let page = 1;
    const resImages: string[] = [];
    while (page <= maxPage) {
      const images: ImageType[] = await client.search(query, {
        page: page,
        size: 'xlarge',
      });

      for (let i = 0; i < images.length && imageCount < count; i++) {
        const image = images[i];
        const width = image.width;
        const height = image.height;
        if (height >= width && height >= 700) {
          if (!resImages.includes(image.url)) {
            resImages.push(image.url);
            imageCount++;
          }
        }
      }

      if (imageCount < count) {
        page++;
      } else {
        imageCount = 0;
        break;
      }
    }
    this.logger.log(`count: ${resImages.length}`);

    return resImages;
  }

  public async imageParse(dto: ImagesParseDto): Promise<ImagesResponseDto> {
    this.logger.log('imageParse');
    const { count, mediaType, query } = dto;
    // Google connect
    const engineId: string = process.env.GOOGLE_SEARCH_ID;
    const apiKey: string = process.env.GOOGLE_API_KEY;

    const client = new GoogleImages(engineId, apiKey);

    let fullQuery;
    switch (mediaType) {
      case 'film': {
        fullQuery = query + ' film poster cover jpg';
        break;
      }
      case 'serie': {
        fullQuery = query + ' series poster cover jpg';
        break;
      }
      case 'comic': {
        fullQuery = query + ' comic cover jpg';
        break;
      }
      case 'book': {
        fullQuery = query + ' book cover jpg';
        break;
      }
    }

    const links = await this.loadImages(fullQuery, count, 1, client);

    return { links };
  }
}
