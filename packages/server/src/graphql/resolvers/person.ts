import { MediaItem, Context } from '../../types';
import {
  QueryResolvers,
  QueryPersonArgs,
  PersonProfile,
  MediaType,
  CastMovieGenre_IdsArgs as CastMovieGenreIdsArgs,
  CastTvGenre_IdsArgs as CastTvGenreIdsArgs,
} from '../../lib/types';
import MediaGenresHandler from '../datasources/the-movie-db-api/handlers/media-genres';

const mediaGenres = new MediaGenresHandler();

const resolvers: QueryResolvers = {
  CastMovie: {
    genre_ids: (
      { genre_ids }: MediaItem,
      { language }: CastMovieGenreIdsArgs,
    ): Promise<string[]> => {
      return mediaGenres.getMediaGenres(
        genre_ids,
        MediaType.Movie.toLowerCase(),
        language,
      );
    },
  },
  CastTV: {
    genre_ids: (
      { genre_ids }: MediaItem,
      { language }: CastTvGenreIdsArgs,
    ): Promise<string[]> => {
      return mediaGenres.getMediaGenres(genre_ids, MediaType.Tv.toLowerCase(), language);
    },
  },
  Query: {
    person: (
      _: {},
      params: QueryPersonArgs,
      { dataSources }: Context,
    ): Promise<PersonProfile | null> => dataSources.tmdb.getPerson(params),
  },
};

export default resolvers;
