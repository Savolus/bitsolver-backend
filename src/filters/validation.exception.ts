import { BadRequestException } from "@nestjs/common";

export class ValidationExceptionClass extends BadRequestException {
    constructor(
        public validationErrors : Record<any, string[]>[]
    ) {
        super();
    }
}
