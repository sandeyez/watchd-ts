export class UrlBuilderService {
  static getMoviePageUrl(movieId: number): string {
    return `/movies/${movieId}`;
  }
}
