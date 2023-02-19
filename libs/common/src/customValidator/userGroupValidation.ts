import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserGroupModel } from '@app/model';

@ValidatorConstraint({ name: 'userGroupValidator', async: true })
export class userGroupValidator implements ValidatorConstraintInterface {
  async validate(id: number, args: ValidationArguments) {
    const data = await UserGroupModel.findByPk(id);
    return (data)? true : false; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return 'Unable to find User Group';
  }
}