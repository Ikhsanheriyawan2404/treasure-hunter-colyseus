import { Request, Response } from "express";
import { db } from "../utils/config.php";
import Helper from "../utils/helper";
import { TokenType } from "@prisma/client";
import TokenService from "../services/token.service";

class AuthController {

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;
      const user = await db.user.create({
        data: {
          name,
          email,
          password: await Helper.encryptPassword(password)
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          created_at: true,
          updated_at: true,
        }
      });

      const tokens = await TokenService.generateAuthTokens(user);
      const data = {
        user: user,
        tokens: tokens
      };
      return Helper.response(res, 200, "Register Success", data);
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const user = await db.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        }
      })
      if (!user || !(await Helper.isPasswordMatch(password, user.password as string))) {
        return Helper.responseErr(res, 401, 'Incorrect email or password', null);
      }

      const tokens = await TokenService.generateAuthTokens(user);
      const data = {
        user: user,
        tokens: tokens,
      };
      return Helper.response(res, 200, `Login Success`, data);
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }

  public logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const refreshTokenData = await db.token.findFirst({
        where: {
          token: refreshToken,
          type: TokenType.REFRESH,
          blacklisted: false
        }
      });
      if (!refreshTokenData) {
        return Helper.response(res, 404, 'Not found', null);
      }
      await db.token.delete({ where: { id: refreshTokenData.id } });
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }

}

export default new AuthController();
