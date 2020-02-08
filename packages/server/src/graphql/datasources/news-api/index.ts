import { RESTDataSource } from 'apollo-datasource-rest';

import { validateArticleResultItem, getRequestParams, parseArticle } from './helpers';
import { ArticleQueryResult, QueryArticlesArgs } from '../../../lib/types';
import { GetArticlesResultItem } from '../../../types';

const BASE_URL = 'http://newsapi.org/v2';
const ENDPOINT = 'everything';
const STATUS_OK = 'ok';
const PAGE_SIZE = 12;

export interface Props {
  getArticles: (args: QueryArticlesArgs) => Promise<ArticleQueryResult>;
}

type GetRequestResponse = {
  articles: GetArticlesResultItem[];
  status: string;
};

class NewsAPI extends RESTDataSource implements Props {
  constructor() {
    super();
    this.baseURL = BASE_URL;
  }

  async getArticles({ page, language }: QueryArticlesArgs): Promise<ArticleQueryResult> {
    const params = getRequestParams(page, language);

    const { status, articles } = await this.get<GetRequestResponse>(ENDPOINT, params);

    if (status !== STATUS_OK) {
      return {
        hasMore: false,
        items: [],
      };
    }

    const result = articles
      .filter((article: GetArticlesResultItem) => validateArticleResultItem(article))
      .map((article: GetArticlesResultItem) => parseArticle(article));

    return {
      hasMore: articles.length === PAGE_SIZE,
      items: result,
    };
  }
}

export default NewsAPI;
