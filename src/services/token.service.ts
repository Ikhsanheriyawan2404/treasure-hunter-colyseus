import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { Token, TokenType } from '@prisma/client';
import { db } from '../utils/config.php';
import dotenv from 'dotenv';

dotenv.config();

interface TokenResponse {
  token: string;
  expires: Date;
}

interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}


class TokenService {

  private secret: string;
  private accessExpirationMinutes?: string;
  private refreshExpirationDays?: string;


  constructor() {
    this.secret = process.env.JWT_SECRET ?? "secret";
    this.accessExpirationMinutes = process.env.JWT_ACCESS_EXPIRATION_MINUTES;
    this.refreshExpirationDays = process.env.JWT_REFRESH_EXPIRATION_DAYS;
  }

  /**
  * Generate token
  * @param {number} userId
  * @param {Moment} expires
  * @param {string} type
  * @param {string} [secret]
  * @returns {string}
  */
  public generateToken = (
    userId: number,
    expires: Moment,
    type: TokenType,
    secret = this.secret
  ): string => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    };
    return jwt.sign(payload, secret);
  };

  /**
  * Save a token
  * @param {string} token
  * @param {number} userId
  * @param {Moment} expires
  * @param {string} type
  * @param {boolean} [blacklisted]
  * @returns {Promise<Token>}
  */
  public saveToken = async (
    token: string,
    user_id: number,
    expires: Moment,
    type: TokenType,
    blacklisted = false
  ): Promise<Token> => {
    const createdToken = db.token.create({
      data: {
        token,
        user_id: user_id,
        expires: expires.toDate(),
        type,
        blacklisted
      }
    });
    return createdToken;
  };

  /**
  * Verify token and return token doc (or throw an error if it is not valid)
  * @param {string} token
  * @param {string} type
  * @returns {Promise<Token>}
  */
  public verifyToken = async (token: string, type: TokenType): Promise<Token> => {
    const payload = jwt.verify(token, this.secret);
    const user_id = Number(payload.sub);
    const tokenData = await db.token.findFirst({
      where: { token, type, user_id, blacklisted: false }
    });
    if (!tokenData) {
      throw new Error('Token not found');
    }
    return tokenData;
  };

  /**
  * Generate auth tokens
  * @param {User} user
  * @returns {Promise<AuthTokensResponse>}
  */
  public generateAuthTokens = async (user: { id: number }): Promise<AuthTokensResponse> => {
    const accessTokenExpires = moment().add(this.accessExpirationMinutes, 'minutes');
    const accessToken = this.generateToken(user.id, accessTokenExpires, TokenType.ACCESS);

    const refreshTokenExpires = moment().add(this.refreshExpirationDays, 'days');
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    };
  };

}

export default new TokenService();
