import { Module } from '@nestjs/common';

import { ContactModule } from '../contact/contact.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [
    ContactModule,
  ],
  controllers: [
    NoteController,
  ],
  providers: [
    NoteService,
  ]
})
export class NoteModule {}
