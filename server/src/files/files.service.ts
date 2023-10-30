import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import * as uuid from 'uuid';
import download from 'image-downloader';
import { FolderType } from './types';
import sharp from 'sharp';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly imageHeight = +process.env.IMAGE_HEIGHT;
  private readonly imageWidth = +process.env.IMAGE_WIDTH;

  constructor(private errorsService: ErrorsService) {}

  //#region Private

  private generatePath(folder: FolderType, name?: string | null): string {
    this.logger.log('generatePath');
    let folderPath = path.resolve(process.cwd(), '..', 'public', folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (name) {
      folderPath = path.join(folderPath, name);
    }

    return folderPath;
  }

  private async convertFile(
    oldFilePath: string,
    newFilePath: string,
    height: number,
    width: number,
  ): Promise<void> {
    this.logger.log('convertFile');
    console.log(oldFilePath);
    await sharp(oldFilePath)
      .toFormat('webp')
      .resize(width, height)
      .toFile(newFilePath)
      .catch((error) => {
        this.errorsService.internalServerError(error);
      });

    fs.unlink(oldFilePath, (error) => {
      if (error) {
        this.errorsService.internalServerError(error);
      }
    });
  }

  private async downloadFile(filePath: string, url: string): Promise<string> {
    this.logger.log('downloadFile', { filePath });
    try {
      const file = await download.image({
        dest: filePath,
        url: url,
        extractFilename: false,
      });
      if (!file) {
        this.errorsService.internalServerError('Downloading error');
      }

      return file.filename;
    } catch (error) {
      this.errorsService.internalServerError(
        'Downloading error. Please try another image',
      );
    }
  }

  private isDownloaded(link: string): boolean {
    const targetSubstring = '/api/public';
    return link.includes(targetSubstring);
  }

  private extractNameFromLink(link: string, folder: FolderType): string {
    const targetSubstring = folder + '/';
    const startIndex = link.indexOf(targetSubstring);
    if (startIndex !== -1) {
      const idStartIndex = startIndex + targetSubstring.length;
      return link.substring(idStartIndex);
    }
    return '';
  }

  private deleteFile(path: string): void {
    this.logger.log('deleteFile');
    fs.unlink(path, (error) => {
      if (error) {
        this.errorsService.internalServerError(error);
      }
    });
  }

  private moveFile(
    name: string,
    sourceFolder: FolderType,
    destinationFolder: FolderType,
  ): string {
    const sourcePath = this.generatePath(sourceFolder, name);
    const destinationPath = this.generatePath(destinationFolder, name);

    fs.rename(
      sourcePath,
      destinationPath,
      (error: NodeJS.ErrnoException | null) => {
        if (error) {
          this.errorsService.internalServerError(error);
        }
      },
    );
    this.logger.log('moveFile', { from: sourcePath, to: destinationPath });
    return `${destinationFolder}/${name}`;
  }

  //#endregion Private

  //#region  Public

  public delete(folder: FolderType, name: string): void {
    this.logger.log('delete');
    const filePath = this.generatePath(folder, name);
    this.deleteFile(filePath);
  }

  public async download(url: string, folder: FolderType): Promise<string> {
    this.logger.log('download');

    if (!url) {
      this.errorsService.badRequest('Empty query');
    }

    const uuidName = uuid.v4();
    const newName = uuidName + '.webp';
    const temporaryName = uuidName + '1' + '.webp';

    const newFilePath = this.generatePath(folder, newName);
    const temporaryFilePath = this.generatePath(folder, temporaryName);

    await this.downloadFile(temporaryFilePath, url);
    await this.convertFile(
      temporaryFilePath,
      newFilePath,
      this.imageHeight,
      this.imageWidth,
    );

    return `${folder}/${newName}`;
  }

  public async create(folder: FolderType, link: string) {
    this.logger.log('create');
    if (!link) return null;
    if (this.isDownloaded(link)) {
      const name = this.extractNameFromLink(link, 'temporary');
      if (!name) return null;
      return this.moveFile(name, 'temporary', folder);
    } else {
      return await this.download(link, folder);
    }
  }

  public async update(
    newLink: string | null,
    oldLink: string | null,
    oldFolder: FolderType,
  ) {
    this.logger.log('update');
    if (!newLink || !oldLink) {
      return null;
    }

    const newName = this.extractNameFromLink(newLink, 'temporary');
    const oldName = this.extractNameFromLink(oldLink, oldFolder);
    this.delete(oldFolder, oldName);
    const result = this.moveFile(newName, 'temporary', oldFolder);
    return result;
  }

  //#endregion Public

  //#region Cron

  public async deleteTemporaryFiles(): Promise<void> {
    this.logger.log('deleteTemporaryFiles');
    const folderPath = this.generatePath('temporary');

    try {
      const files = await fs.promises.readdir(folderPath);

      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileStats = await fs.promises.stat(filePath);

        if (fileStats.isFile() && fileStats.ctime < oneDayAgo) {
          await fs.promises.unlink(filePath);
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  //#endregion Cron
}
