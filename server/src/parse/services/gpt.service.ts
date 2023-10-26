import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import MyError from 'src/utils/errors';
import { Promts } from '../constants';
import { MediaType } from 'src/media/types';
import { GetTitleResponse } from '../dto';

@Injectable()
export class GptService {
  private readonly logger = new Logger(GptService.name);
  private readonly error = new MyError();

  //#region Private

  private async sendMessage(
    systemMessage: string,
    userMessage: string,
    temperature: number,
    max_tokens: number,
  ) {
    try {
      const openAi = new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
      });
      const completion = await openAi.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: temperature,
        max_tokens: max_tokens,
      });

      const answer = completion.choices[0].message.content;

      this.logger.log(
        `Usage: ${completion.usage?.total_tokens} tokens (${(
          ((completion.usage?.prompt_tokens || 0) * 0.0015 +
            (completion.usage?.completion_tokens || 0) * 0.002) /
          1000
        ).toFixed(7)}$)`,
      );

      return answer;
    } catch (err) {
      this.error.internalServerError('Send message to OpenAI error');
    }
  }

  private convertToJson(response: string) {
    const regex = /[{].*[}]$/s;
    const jsonString = response.match(regex);
    if (!jsonString) {
      return null;
    }
    const jsonResponse = JSON.parse(jsonString[0]);
    return jsonResponse;
  }

  private buildMessages(workPromts: any, inputKeys: string[]) {
    // SystemMessage1 - plot, genres, tags
    // SystemMessage2 - all others
    const promtsArray1 = [];
    const promtsArray2 = [];

    promtsArray1.push(Promts.StartParsePromt);
    promtsArray2.push(Promts.StartParsePromt);

    promtsArray1.push(workPromts.description);
    promtsArray1.push(workPromts.genres);
    promtsArray1.push(workPromts.tags);

    Object.keys(workPromts).forEach((key) => {
      if (
        inputKeys.includes(key) &&
        key !== 'description' &&
        key !== 'genres' &&
        key !== 'image' &&
        key !== 'tags'
      ) {
        promtsArray2.push(workPromts[key]);
      }
    });

    const systemMessage1 = promtsArray1.join('\n');
    const systemMessage2 = promtsArray2.join('\n');

    this.logger.log(
      `PlotGenresTagsMessage: \n(${systemMessage1}).\n OtherFieldsMessage: \n(${systemMessage2})`,
    );
    return { systemMessage1, systemMessage2 };
  }

  //#endregion Private

  //#region Public
  public async getTitle(
    mediaType: MediaType,
    query: string,
  ): Promise<GetTitleResponse> {
    this.logger.log('titleParse');

    const gptAnswer = await this.sendMessage(
      Promts.getSearchTitlePrompt(mediaType),
      query,
      0.5,
      100,
    );
    if (!gptAnswer) {
      this.error.notFound('Nothing was found for your search');
    }
    const jsonAnswer = this.convertToJson(gptAnswer);
    const result: GetTitleResponse = {
      title: jsonAnswer.title,
      year: Number(jsonAnswer.year),
    };
    if (!result.title && !result.year) {
      this.error.notFound('Not found title and year');
    }
    return result;
  }

  public async getFields(
    mediaType: MediaType,
    title: string,
    keys: string[],
  ): Promise<unknown> {
    this.logger.log('fieldsParse');

    let workPromts;
    switch (mediaType) {
      case 'film': {
        workPromts = Promts.FilmPromts;
        break;
      }
      case 'serie': {
        workPromts = Promts.SeriesPromts;
        break;
      }
      case 'book': {
        workPromts = Promts.BookPromts;
        break;
      }
      case 'comic': {
        workPromts = Promts.ComicsPromts;
        break;
      }
    }
    const { systemMessage1, systemMessage2 } = this.buildMessages(
      workPromts,
      keys,
    );

    // SystemMessage1 - plot, genres, tags
    // SystemMessage2 - all others

    const gptAnswer1 = await this.sendMessage(systemMessage1, title, 1, 300);

    const jsonAnswer1 = this.convertToJson(gptAnswer1 || '');
    if (systemMessage2 === Promts.StartParsePromt) {
      return jsonAnswer1;
    }

    const gptAnswer2 = await this.sendMessage(systemMessage2, title, 1, 500);
    const jsonAnswer2 = this.convertToJson(gptAnswer2 || '');

    if (jsonAnswer2 && jsonAnswer1) {
      jsonAnswer2.genres = jsonAnswer1.genres;
      jsonAnswer2.tags = jsonAnswer1.tags;
      jsonAnswer2.description = jsonAnswer1.description;
    }
    return jsonAnswer2;
  }

  public async getEmbedding(userMessage: string): Promise<number[]> {
    this.logger.log('getEmbedding');
    const openAi = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
    const completion = await openAi.embeddings.create({
      model: 'text-embedding-ada-002',
      input: userMessage,
    });
    const embedding = completion.data[0].embedding;

    this.logger.log(
      `Usage ${completion.usage.total_tokens} tokens (${(
        (completion.usage.total_tokens * 0.0001) /
        1000
      ).toFixed(7)}$)`,
    );
    return embedding;
  }
  //#endregion Public
}
