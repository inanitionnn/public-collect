import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [ErrorsModule],
  exports: [FilesService],
  providers: [FilesService],
})
export class FilesModule {}
