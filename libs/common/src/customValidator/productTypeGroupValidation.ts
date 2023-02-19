import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { ProductTypeGroupModel } from "@app/model";

@ValidatorConstraint({ name: "productTypeGroupValidator", async: true })
export class productTypeGroupValidator implements ValidatorConstraintInterface {
  async validate(id: number, args: ValidationArguments) {
    const data = await ProductTypeGroupModel.findByPk(id);
    return data ? true : false; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return "Unable to find Product Type Group";
  }
}
