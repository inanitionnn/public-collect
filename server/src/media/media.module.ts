import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesModule } from 'src/files';
import { FilmsModule } from 'src/films';

@Module({
  imports: [FilesModule, FilmsModule],
  providers: [MediaService],
})
export class MediaModule {}
