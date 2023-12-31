import { TypeTableCaption } from '../../../../type-element/type-html/table/caption/caption.abstract';
import { Table } from '../table.class';
import { ITableCaption } from './caption.interface';
export class TableCaption extends TypeTableCaption implements ITableCaption {
  className: 'TableCaption';
  constructor(public parent: Table) {
    super();
    this.className = 'TableCaption';
    this.childNodes = [];
  }
}
