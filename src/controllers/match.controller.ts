import { Request, Response } from "express";
import { db } from "../utils/config.php";
import Helper from "../utils/helper";

class MatchController {
  public listMatch = async (_: Request, res: Response): Promise<Response> => {
    try {
      const matchs = await db.match.findMany({
        orderBy: {
          created_at: "desc"
        },
        take: 10
      });

      return Helper.response(res, 200, "List Matchs", matchs);
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    }
  }

  public endGame = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;
    const { points, room } = req.body;

    try {
      // Mulai transaksi
      await db.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: {
            id: Number(userId)
          }
        });

        if (!user) {
          return Helper.responseErr(res, 404, "User not found", null);
        }

        // Update poin pengguna dalam transaksi
        await tx.user.update({
          where: {
            id: Number(userId)
          },
          data: {
            points: user.points + points
          }
        });

        // Buat pertandingan dalam transaksi
        const match = await tx.match.create({
          data: {
            user_id: Number(userId),
            points: points,
            room: room
          }
        });

        return Helper.response(res, 200, "End Match", match);
      });
    } catch (e: any) {
      return Helper.responseErr(res, 500, e.message, e.errors);
    } finally {
      await db.$disconnect(); // Pastikan untuk selalu memutuskan koneksi database
    }

  }
}

export default new MatchController();
