import {
  CreateQuery,
  FilterQuery,
  Model,
  Document,
  UpdateQuery,
} from "mongoose";

import { ResponseError } from "../errors";

export interface IWrite<T, TDocument> {
  create(query: CreateQuery<TDocument>): Promise<T>;
  update(
    filter: FilterQuery<TDocument>,
    query: UpdateQuery<TDocument>
  ): Promise<T>;
}

export interface IRead<T, TDocument> {
  findOne(query: FilterQuery<TDocument>): Promise<T>;
}

export abstract class BaseRepository<T, TDocument extends Document>
  implements IWrite<T, TDocument>, IRead<T, TDocument> {
  constructor(
    private getModel: () => Promise<Model<TDocument>>,
    public entityName: string
  ) {}

  parseDocument(doc: TDocument): T {
    throw new Error("Method not implemented.");
  }

  public async create(query: CreateQuery<TDocument>): Promise<T> {
    const model = await this.getModel();
    const newDoc = await model.create(query);

    return this.parseDocument(newDoc);
  }

  public async update(
    filter: FilterQuery<TDocument>,
    query: UpdateQuery<TDocument>
  ): Promise<T> {
    const model = await this.getModel();
    await model.update(filter, query);

    return this.findOne(query);
  }

  public async findDocument(query: FilterQuery<TDocument>): Promise<TDocument> {
    const model = await this.getModel();
    const doc = await model.findOne(query);

    if (!doc) {
      throw new ResponseError(`Could not find ${this.entityName}`, 404);
    }
    return doc;
  }

  public async findOne(query: FilterQuery<TDocument>): Promise<T> {
    const doc = await this.findDocument(query);
    return this.parseDocument(doc);
  }
}
