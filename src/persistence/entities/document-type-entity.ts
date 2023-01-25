import { IDocumentTypeModel } from "src/models/i-document-type-model";
import { v4 as uuid } from 'uuid';

export class DocumentTypeEntity implements IDocumentTypeModel{

    id = uuid();
    name: string;
    state = true;
}