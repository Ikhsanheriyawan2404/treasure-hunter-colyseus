import { Request, Response } from "express";
import { db } from "../utils/config.php";
import Helper from "../utils/helper";

class UserController {

  public listUser = async (_: Request, res: Response): Promise<Response> => {
    try {
      const users = await db.user.findMany();

      return Helper.response(res, 200, "List Users", users);
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }

  public getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = await db.user.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!user) {
        return Helper.responseErr(res, 404, "User not found", null);
      }
      return Helper.response(res, 200, "Get User", user);
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }

  public usersRank = async (_: Request, res: Response): Promise<Response> => {
    try {
      const users = await db.user.findMany({
        orderBy: {
          points: "desc"
        },
        take: 10
      });

      return Helper.response(res, 200, "List Users Ranking", users);
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }
}

export default new UserController();
