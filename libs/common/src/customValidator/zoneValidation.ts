import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ZoneModel } from '@app/model';

@ValidatorConstraint({ name: 'zoneValidation', async: true })
export class zoneValidation implements ValidatorConstraintInterface {
  async validate(id: number, args: ValidationArguments) {
    const data = await ZoneModel.findByPk(id);
    return (data)? true : false; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return 'Unable to find Zone';
  }
}