import { NumberNotRequired, StringNotRequired } from "src/common/decorators";
import { UserRoles } from "src/models";

export class FilterUserDto {
    @StringNotRequired()
    search?: string;

    @StringNotRequired()
    role?: UserRoles;

    @NumberNotRequired()
    page?: number;

    @NumberNotRequired()
    limit?: number;

    @StringNotRequired()
    sortBy?: string;

    @StringNotRequired()
    sortOrder?: string;
}