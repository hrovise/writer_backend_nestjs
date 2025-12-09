import { prop } from '@typegoose/typegoose';

export class Chunk {
  @prop({ required: true })
  text!: string;

  @prop({ required: true })
  length!: number;

  @prop({ required: true })
  index!: number;
}
