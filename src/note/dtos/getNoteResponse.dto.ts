export class GetNoteResponseDto {
    constructor(
        public id: number,
        public contactId: number,

        public content: string,

        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
