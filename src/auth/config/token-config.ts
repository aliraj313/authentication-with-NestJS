export class TokenConfig {
  accessTokenSecret: string =
    process.env.JWT_ACCESS_TOKEN || 'access token secret';
  refreshTokenSecret: string =
    process.env.JWT_REFRESH_TOKEN || 'refresh token secret';
  accessTokenExpire: string = '1h';
  accessTokenAlgorithm: string = 'HS512';

  refreshTokenExpire: string = '1w';
  refreshTokenAlgorithm: string = 'HS512';
}
