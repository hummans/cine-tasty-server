import { RESTDataSource } from 'apollo-datasource-rest';

import env from '../../config/environment';

interface APIOutput {
  publishedAt: string;
  urlToImage: string;
  source: {
    id?: string;
    name: string;
  };
  author: string;
  title: string;
  url: string;
}

interface Article {
  publishedAt: string;
  source: string;
  author: string;
  image: string;
  title: string;
  url: string;
  id: string;
}

const BASE_URL = 'http://newsapi.org/v2';
const ENDPOINT = 'everything';
const STATUS_OK = 'ok';
const QUERY = 'cinema';

class NewsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = BASE_URL;
  }

  parseArticle({
    publishedAt,
    urlToImage,
    source,
    author,
    title,
    url,
  }: APIOutput): Article {
    const { name, id } = source;

    return {
      image: urlToImage,
      id: id || url,
      source: name,
      publishedAt,
      author,
      title,
      url,
    };
  }

  getFromParam(): string {
    const today = new Date();

    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const day = today
      .getDate()
      .toString()
      .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  validateAPIOutput(output: APIOutput): boolean {
    return Object.entries(output).every(([, value]) => !!value);
  }

  async getAllArticles(): Promise<Article[]> {
    const from = this.getFromParam();

    const { status, articles } = await this.get(ENDPOINT, {
      apiKey: env.NEWS_API_KEY,
      q: QUERY,
      from,
    });

    if (status !== STATUS_OK) {
      return [];
    }

    const result = articles
      .filter((article: APIOutput) => this.validateAPIOutput(article))
      .map((article: APIOutput) => this.parseArticle(article));

    return result;
  }
}

export default NewsAPI;