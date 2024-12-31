import { Request, Response, NextFunction } from 'express';
import { 
  checkNewUserRequiredFields, 
  validateCoverImgURL, 
  validateEmail, 
  validateFollowers, 
  validateFollowing, 
  validatePassword, 
  validateProfileImgURL, 
  validateUserFullName, 
  validateUsername 
} from './userDataValidator';


export async function validateNewUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
  // const requiredFieldsValidationResult = await checkNewUserRequiredFields(req);
  // if (!requiredFieldsValidationResult.isValid) {
  //   res.status(400).json({
  //     success: false,
  //     validationLocation: requiredFieldsValidationResult.validationLocation,
  //     errorMessages: requiredFieldsValidationResult.errorMessages
  //   });
  // }

  // const usernameValidationResult: any = await validateUsername(req);
  // if (!usernameValidationResult.isValid) {
  //   const statusCode = usernameValidationResult.errorMessages[0].includes('Duplicate') ? 409 : 400;
  //   res.status(statusCode).json({
  //     success: false,
  //     statusCode: statusCode,
  //     error: usernameValidationResult
  //   });
  //   return;
  // }

  // const fullNameValidationResult: any = await validateUserFullName(req);
  // if (!fullNameValidationResult.isValid) {
  //   res.status(400).json({
  //     success: false,
  //     statusCode: 400,
  //     error: fullNameValidationResult
  //   });
  // }


  // const emailValidationResult: any = await validateEmail(req);
  // if (!emailValidationResult.isValid) {
  //   const statusCode = emailValidationResult.errorMessages[0].includes('Duplicate') ? 409 : 400;
  //   res.status(statusCode).json({
  //     success: false,
  //     statusCode: statusCode,
  //     error: emailValidationResult
  //   });
  //   return;
  // }


  // const passwordValidationResult: any = await validatePassword(req);
  // if (!passwordValidationResult.isValid) {
  //   res.status(400).json({
  //     success: false,
  //     statusCode: 400,
  //     error: passwordValidationResult
  //   });
  //   return;
  // }

  
  // const followersValidationResult: any = await validateFollowers(req);
  // if (!followersValidationResult.isValid) {
  //   res.status(400).json({
  //     success: false,
  //     statusCode: 400,
  //     error: followersValidationResult
  //   });
  //   return;
  // }


  // const followingValidationResult: any = await validateFollowing(req);
  // if (!followingValidationResult.isValid) {
  //   res.status(400).json({
  //     success: false,
  //     statusCode: 400,
  //     error: followingValidationResult
  //   });
  //   return;
  // }


  // const profileImgURLValidationResult: any = await validateProfileImgURL(req);
  // if (!profileImgURLValidationResult.isValid) {
  //   res.status(400).json({
  //     success: false,
  //     statusCode: 400,
  //     error: profileImgURLValidationResult
  //   });
  //   return;
  // }


  const coverImgURLValidationResult: any = await validateCoverImgURL(req);
  if (!coverImgURLValidationResult.isValid) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      error: coverImgURLValidationResult
    });
    return;
  }

  next();
}