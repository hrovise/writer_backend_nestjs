import { modelOptions, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { DocumentType } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'user',
    versionKey: false,
  },
})
export class UserModel extends TimeStamps {
 

  @prop({ required: true })
  email: string;


  @prop({required: true })
  role: string;

   @prop({required: true })
  passwordHash: string;
}

export type UserDocument = DocumentType<UserModel>;