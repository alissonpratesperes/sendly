export interface JwtTokenPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}
