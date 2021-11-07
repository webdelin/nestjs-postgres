export class CreatePostDto {
    readonly title: string;
    readonly description: string;
    readonly active: boolean;
    readonly userId: string;
}