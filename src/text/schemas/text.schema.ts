import { modelOptions, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Chunk } from './chunk.schema';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'text',
    versionKey: false,
  },
})
export class TextModel extends TimeStamps {
  @prop({ required: true, type: () => [Chunk] })
  chunks!: Chunk[];

  @prop({ required: true })
  chunksCount: number;
  @prop({ required: true })
  totalLengthText: number;

  @prop({ unique: true, required: true })
  title: string;

  @prop({ required: true })
  genre: string;

  @prop()
  srcImg?: string | undefined;
}
