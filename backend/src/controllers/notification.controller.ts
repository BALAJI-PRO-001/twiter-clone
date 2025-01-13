import { Request, Response, NextFunction } from "express";
import Notification from "../models/notification.model";
import { StatusCodes as STATUS_CODES } from 'http-status-codes';

export async function getNotification(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  
  try {
    const userId = req.verifiedUserId;

    const notifications = await Notification.find({ to: userId })
      .populate({ 
        path: 'from',
        select: 'username profileImgURL'
      });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        notifications: notifications
      }
    });
  } catch(err) {
    next(err);
  }
}



export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
  try {
    const userId = req.verifiedUserId;
    
    await Notification.deleteMany({ to: userId });
    res.status(STATUS_CODES.NO_CONTENT).json({});
  } catch(err) {
    next(err);
  }
}