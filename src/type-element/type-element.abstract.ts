import { Subscription } from 'rxjs';
import { humpToMiddleLine } from 'type-utils';
import { Parser } from '../parser/parser.class';
import { TypeNode } from '../type-node/type-node.abstract';
import { TextNode } from '../text-node/text-node.class';
import { StyleCursor, StyleDisplay } from '../style/style.enum';
import { IStyle } from '../style/style.interface';
import { XElement } from '../element/x-element/x-element.class';
import {
  ITypeAttribute,
  IBoundBox,
  ITypeElement,
  ITypeProperty,
} from './type-element.interface';

import { IXElementOption } from '../element/x-element/x-element.interface';

import { ITypeNode } from '../type-node/type-node.interface';
/**
 * 虚拟元素Element的数据结构
 * 可以对应到虚拟dom树。 createDom(tag, attr, children)
 * 与对应的导出时的数据结构是不一样的。
 * todo 是否需要把相关的操作也添加进来。
 */
const vHash = Math.round(Math.random() * 1000000);
export abstract class TypeElement extends TypeNode implements ITypeElement {
  abstract override className: string;
  abstract override parent?: TypeElement;
  abstract override dom?: HTMLElement | SVGElement;
  abstract override nodeName: string;
  nodeValue: undefined;
  declare propObj: ITypeProperty;
  // attributes: INodeAttr[];
  childNodes: TypeNode[];
  declare events: Subscription[];
  initEvents?(): void;
  protected constructor() {
    super();
    this.propObj = {
      attrObj: {},
      styleObj: {}
    };
    this.addAttrObj({
      ['data-v-' + vHash]: true
    });
    // this.nodeName = nodeName;
    this.attributes = [];
    this.childNodes = [];
    this.events = [];
  }
  get tempItem(): any {
    if (this.data) {
      return this;
    } else if (this.parent === this) {
      return this;
    } else {
      return this.parent?.tempItem;
    }
  }
  get itemData(): Record<string, any> | undefined {
    if (this.data) {
      return this.data;
    } else if (this.parent === this) {
      return this;
    } else if (this.parent) {
      return this.parent.itemData;
    } else {
      return this;
    }
  }
  get length(): number {
    return this.childNodes.length;
  }
  get index(): number {
    return this.parent ? this.parent.findChildIndex(this) : -1;
  }
  get attrObj(): Partial<ITypeAttribute> {
    return this.propObj.attrObj;
  }
  get styleObj(): Partial<IStyle> {
    return this.propObj.styleObj;
  }

  override get firstChild(): TypeNode {
    return this.children[0];
  }

  get lastChild(): TypeNode {
    return this.children[this.length - 1];
  }

  // get clientHeight(): string {
  //   return (this.dom.clientHeight / mm2pxRatio).toFixed(2) + "mm"; // px ---> mm
  // }

  /**
   * 获取dom的高度，带单位的。
   * 包括margin的高度。
   * margin 的单位 px ---> 单位换算
   */
  // get elementHeight(): string {
  //   const style = getComputedStyle(this.dom);
  //   const marginTop = parseFloat(style.marginTop);
  //   const marginBottom = parseFloat(style.marginBottom);
  //   const itemHeight = this.dom.offsetHeight + marginTop + marginBottom;
  //   return (itemHeight / mm2pxRatio).toFixed(2) + "mm"; // px ---> mm
  // }

  get id(): string {
    return this.attrObj.id as string;
  }
  // get value(): string | undefined {
  //   return this.attrObj.value ? this.attrObj.value as string : undefined;
  // }
  // set value(str: string | undefined) {
  //   if (str !== undefined) {
  //     this.setAttrObj({
  //       value: str,
  //     });
  //   } else {
  //     this.removeAttribute('value');
  //   }
  // }
  setCursor(cursor: StyleCursor) {
    this.setStyleObj({
      cursor
    });
  }
  setAttrId(id: string): void {
    this.addAttrId(id);
    this.renderAttrId(id);
  }

  addAttrId(id: string): void {
    this.propObj.attrObj.id = id;
  }
  renderAttrId(id: string): void {
    this.dom?.setAttribute('id', id);
  }
  // 设置属性 会清理原有属性
  setPropObj(propObj: ITypeProperty): void {
    if (this.propObj) {  // 清理原有属性
      for (const key in this.propObj.attrObj) {
        this.removeAttribute(key);
      }
      // for (const style in this.propObj.styleObj) {
      //   this.removeStyle(style as keyof IStyle);
      // }
      this.dom?.removeAttribute('style');
    }
    this.propObj = propObj;
    this.setAttrObj(propObj.attrObj);
    this.setStyleObj(propObj.styleObj);
  }

  // todo 类型验证 set ???----> replace
  // todo 累加
  setStyleObj(styles: Partial<IStyle>): TypeElement {
    for (const key in styles) {
      if (Object.hasOwnProperty.call(styles, key)) {
        // todo 如何优化
        const value = styles[key as keyof IStyle] as string | number | boolean;
        this.setStyle(key as keyof IStyle, value);
      }
    }
    return this;
  }
  addStyleObj(styles: Partial<IStyle>): void {
    for (const key in styles) {
      if (Object.hasOwnProperty.call(styles, key)) {
        // todo 如何优化
        const value = styles[key as keyof IStyle] as string | number | boolean;
        this.addStyle(key as keyof IStyle, value);
      }
    }
  }
  renderStyleObj(styles: Partial<IStyle>): void {
    for (const key in styles) {
      if (Object.hasOwnProperty.call(styles, key)) {
        // todo 如何优化
        const value = styles[key as keyof IStyle] as string | number | boolean;
        this.renderStyle(key as keyof IStyle, value);
      }
    }
  }
  setStyle(key: keyof IStyle, value: string | number | boolean): void {
    // todo 是否要删除属性。
    // if (!value) {
    //   delete this.propObj.styleObj[key];
    // }
    // if (key === 'display') {
    //   console.warn('key === display, value is ', value);
    // }
    // todo type ???
    if (value !== undefined) {
      this.addStyle(key, value);
      // 直接dom操作
      this.renderStyle(key, value);
    } else {
      this.removeStyle(key);
    }
    // todo error
    // Object.defineProperty(this.propObj.styleObj, key, value);
  }
  addStyle(key: keyof IStyle, value: string | number | boolean): void {
    (this.propObj.styleObj as Record<string, string | number | boolean>)[key] = value;
  }
  renderStyle(key: keyof IStyle, value: string | number | boolean): void {
    this.dom?.style.setProperty(humpToMiddleLine(key), String(value)); // 要转中划线
  }
  // 删除样式
  removeStyle(key: keyof IStyle): void {
    if (this.propObj.styleObj[key]) {
      delete this.propObj.styleObj[key];
    }
    this.dom?.style.removeProperty(humpToMiddleLine(key));
    // delete this.dom.style[key as keyof CSSStyleDeclaration];
  }
  /**
   * 默认显示是  block
   * 可指定具体显示模式
   * @param mode
   */
  show(mode?: StyleDisplay): void {
    this.setStyle('display', mode || 'block'); // flex block inline-block
  }
  hide(): void {
    this.setStyle('display', 'none');
  }
  // 不影响已有的，但是没有传的属性
  setAttrObj(attrObj: Partial<ITypeAttribute>): TypeElement {
    for (const key in attrObj) {
      if (Object.hasOwnProperty.call(attrObj, key)) {
        // todo 如何优化
        const value = attrObj[key] as string | number;
        this.setAttribute(key, value);
      }
    }
    return this;
  }
  addAttrObj(attrObj: Partial<ITypeAttribute>): TypeElement {
    for (const key in attrObj) {
      if (Object.hasOwnProperty.call(attrObj, key)) {
        const value = attrObj[key] as string | number;
        this.addAttribute(key, value);
      }
    }
    return this;
  }
  renderAttrObj(attrObj: Partial<ITypeAttribute>): TypeElement {
    for (const key in attrObj) {
      if (Object.hasOwnProperty.call(attrObj, key)) {
        const value = attrObj[key] as string | number;
        this.renderAttribute(key, value);
      }
    }
    return this;
  }
  // 设置属性 dom 属性同步变化
  setAttribute(key: string, value: string| number | boolean): TypeElement {
    this.addAttribute(key, value);
    this.renderAttribute(key, value);
    return this;
  }
  // 添加属性
  addAttribute(key: string, value: string| number | boolean): void {
    this.propObj.attrObj[key] = value;
  }
  // 渲染属性
  renderAttribute(key: string, value: string| number | boolean): void {
    // dom渲染时， 驼峰转中划线连接
    if (key !== 'viewBox' && key !== 'spreadMethod' && key !== 'gradientUnits') {
      key = humpToMiddleLine(key);
    }
    if (value === true) {
      this.dom?.setAttribute(key, '');
    } else if (value === false) {
      this.dom?.removeAttribute(key);
    } else if (value === undefined) {
      // console.log('value is ', value);
      this.dom?.removeAttribute(key);
    } else {
      const val = value.toString();
      this.dom?.setAttribute(key, val);
    }
  }
  setAttrName(value: string): TypeElement {
    this.addAttrName(value);
    this.renderAttrName(value);
    return this;
  }
  addAttrName(value: string): void {
    this.propObj.attrObj.name = value;
  }
  renderAttrName(value: string): void {
    this.dom?.setAttribute('name', value);
  }
  removeAttribute(key: string): TypeElement {
    if (this.propObj.attrObj[key]) {
      delete this.propObj.attrObj[key];
    }
    this.dom?.removeAttribute(key);
    return this;
  }
  addDomClassName(className: string): TypeElement {
    // 要先判断className是否已经存在
    if (this.propObj.attrObj?.class?.indexOf(className) === -1) {
      this.propObj.attrObj.class += ' ' + className;
    }
    this.dom?.classList.add(className);
    // this.dom.setAttribute('class', String(this.propObj.attrObj.class).trim());
    return this;
  }
  removeDomClassName(className: string): TypeElement {
    String(this.propObj.attrObj.class).replace(className, '');
    this.dom?.classList.remove(className);
    return this;
  }
  /**
   * 在最后位置添加一个子节点。
   * 如果newChild.parent存在，则可能需要执行newChild?.parent.removeChild(newChild)。需要根据业务逻辑判断。
   * 渲染到dom上
   * @param newChild
   */
  // abstract appendChild(newChild: TypeElement | TextNode): TypeElement | TextNode;
  appendChild(newChild: TypeNode): void {
    newChild.setParent(this); // 如果不是子类，是其它地方的对象加过来，要重设其父类。
    this.renderChild(newChild);
    // this.dom.appendChild(newChild.render().dom);
  }

  /**
   * 从前面添加子元素
   * @param newChild
   */
  unshiftChild(newChild: TypeNode): void {
    this.childNodes.unshift(newChild);
  }
  addChild(newChild: TypeNode): void {
    this.childNodes.push(newChild);
  }
  addChildren(...newChildren: TypeNode[]): void {
    this.childNodes.push(...newChildren);
  }
  /**
   * 通常与appendChild同时使用，但也有可能，分离开来使用
   * dom子节点会被重新渲染一遍。
   * WebPage是单独处理的。
   * @param newChild
   */
  renderChild(newChild: TypeNode): void {
    newChild.render();
    if (newChild.dom) {
      this.dom?.appendChild(newChild.dom);
    }
  }

  // appendChildren(newNodes: Array<TypeElement | WebText>) {
  //   this.childNodes.push(...newNodes);
  //   newNodes.map(child => child.setParent(this));
  // }

  /**
   * 在指定下标插入新的文本或节点。
   * @param child
   * @param index 要插入的目标位置
   */
  // insertChild(child: TypeElement | TextNode, index: number) {
  //   this.childNodes.splice(index, 0, child);
  //   child.setParent(this);
  //   return child;
  // }

  /**
   * 在子元素指定下标位置插入Dom节点
   * 不再与数据层操作直接绑定了。
   * 另外，页面中插入需要单独实现。
   * @param newChild
   * @param index 数组下标
   */
  insertChildDom(newChild: TypeElement | TextNode, index: number): void {
    // 判断newChild是否已经插入到数据层中。默认应该先插入数据层，再插入dom树。
    // if (!this.parent) {
    //   console.error('newChild has no parent . ');
    //   return
    // }
    // 如果下标位置已有dom节点。
    if (this.childNodes.length > index + 1) {
      if (newChild.dom !== undefined) {
        this.dom?.insertBefore(newChild.dom, this.dom.childNodes[index]);
      }
    } else {
      this.renderChild(newChild);
    }
  }

  // insertChildren(children: Array<TypeElement | WebText>, index: number) {
  //   this.childNodes.splice(index, 0, ...children);
  //   children.map(child => child.setParent(this));
  //   return children;
  // }

  /**
   * 移除指定下标的子元素。
   * @param index 从0开始。
   * @param length
   */
  removeChildAtIndex(index: number, length = 1): void {
    this.removeChildDomAtIndex(index, length);
    this.childNodes.splice(index, length);
  }
  /**
   * 移除指定下标的dom子节点。
   * WebPage的removeChildDom相对特殊，要单独处理。
   * 注： 要在removeChild前执行。
   * @param index
   * @param length 移除的个数
   */
  removeChildDomAtIndex(index: number, length = 1): void {
    for (let i = 0; i < length; i++) {
      if (this.childNodes[index + i].dom) {
        // this.dom.removeChild(this.childNodes[index + i].dom);
        this.childNodes[index + i].dom?.remove();
      }
    }
  }
  /**
   * 从父级中删除
   */
  removeFromParent(): void {
    if (this.parent) {
      this.parent.childNodes.splice(this.index, 1);
    } else {
      console.error('this.parent is null . ');
    }
  }
  /**
   * 清理子节点
   */
  clearChild(): void {
    this.clearChildNodes();
    this.clearChildDom();
  }
  /**
   * 清除dom所有子节点
   * render时使用
   */
  clearChildDom(): void {
    let first = this.dom?.firstElementChild;
    while (first) {
      first.remove();
      first = this.dom?.firstElementChild;
    }
  }
  // 替换
  // replaceChild(newNode: TypeElement, oldNode: TypeElement): void {
  //   const index = this.childNodes.indexOf(oldNode);
  //   if (index > -1) {
  //     // 替换操作
  //     this.childNodes.splice(index, 1, newNode);
  //     oldNode.parent = undefined;
  //     newNode.parent = this;
  //     return;
  //   }
  //   throw Error('node to be replaced is not a child of the current node . ');
  // }

  // 清理子节点
  clearChildNodes(): void {
    this.childNodes = [];
  }

  /**
   * 清除自有dom节点。对象自身还没有被删除。
   * 删除对象，要在父级中。
   * this.dom的值也没有变。
   */
  removeDom(): void {
    if (this.dom) {
      this.dom.remove();
    } else {
      console.error('this.dom has been removed . ');
    }
  }

  // todo 子类中实现 ？？？？
  // abstract clone<T>(): T; // 复制
  // 会循环调用
  // clone(): TypeElement {
  // //   const attrObj: { [key: string]: boolean | string | number } = {};
  // //   const styleObj: Partial<IStyle> = {};
  // //   this.attrObj.forEach(((value, key) => {
  // //     attrs[key] = value
  // //   }));
  // //   for (const styleName in this.styleObj) {
  // //     styleObj[styleName] = this.styleObj[styleName];
  // //   }
  // //   // this.styleObj.forEach((value, key) => {
  // //   //   styleObj[key] = value;
  // //   // })
  // //   return new VElement(this.nodeName, {
  // //     classes: [...this.classes],
  // //     attrs,
  // //     styles,
  // //     childNodes: this.childNodes.map(i => i.clone())
  // //   });
  //   const propObj = deepClone(this.propObj);
  //   console.log('clone propObj is ', propObj);
  //   const literalJson = toJSON(this);
  //   console.log('literalJson is ', literalJson);
  //   // if (this.parent instanceof WebPage) {
  //   //   const obj = new ControlClassMap[this.className](this.parent);
  //   //   console.log('obj is ', obj);
  //   // }
  //   return this;
  // }

  findChildAtIndex(index: number): TypeNode | null {
    return this.childNodes[index] || null;
  }

  findChildIndex(child: TypeElement | TextNode): number {
    return this.childNodes.findIndex(item => item === child);
  }
  removeEvents(): void {
    this.events.forEach(event => {
      event.unsubscribe();
    });
    this.events = [];
  }
  // 移除监听
  clearEvents(): void {
    this.events.map(item => item.unsubscribe());
  }
  get boundBox(): IBoundBox {
    if (this.dom === undefined) {
      return {
        left: '0',
        top: '0',
        width: '0',
        height: '0'
      };
    }
    const { left, top, width, height } = this.dom?.getBoundingClientRect();
    // console.log('left is ', left, 'top is ', top, 'width is ', width, 'height is ', height);
    return {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px'
    };
  }
  // 子类中有需要的地方覆写
  // setConfig(config?: Record<string, any>) {
  //   if (config) {
  //     this.setAttrObj(config as Partial<ITypeAttribute>);
  //   }
  // }
  /**
   * 默认初始化方法
   * 清理多余的对象。
   * @param literal
   */
  createInstance(literal: ITypeElement): void {
    this.setPropObj(literal.propObj);
    const length = literal.childNodes.length;
    if (length < this.length) {
      for (let i = 0; i < this.length; i++) {
        // this.childNodes的对象和literal.childNodes的字面量要对应。
        //    如果不一致，应该清除原有的对象，根据字面量的值创建相应的对象。
        if (i > length - 1) {
          this.childNodes[i].dom?.remove();
        }
      }
      this.childNodes.length = length;
    }
  }
  createItem<T extends(TextNode | TypeElement)>(parent: TypeElement, node: ITypeNode): T {
    let item: T;
    if (node.nodeValue !== undefined) { // 如果是文本节点，则退出迭代
      item = new TextNode(node.nodeValue) as T;
      parent.addChild(item);
      return item;
    } else if (node.template !== undefined) {
      const parser = new Parser();
      item = parser.parseFromString(node.template) as T;
      //   todo 绑定和指令等
      if (node.data !== undefined) {
        console.log('node.data is ', node.data);
        item.data = node.data;
      }
      if (node.methods !== undefined) {
        console.log('node.on is ', node.methods);
        (item as XElement).methods = node.methods;
      }
    } else {
      // todo TypeClass 为 XElement时的处理
      //    XElement(config) ??? there is not parent .
      // if (node.TypeClass === XElement) { // Uncaught ReferenceError: Cannot access 'TypeElement' before initialization
      //   item = new node.TypeClass(node) as T; // 创建类实例
      // } else {
      item = new node.TypeClass(node.config) as T; // 创建类实例
      // }
    }
    // console.log('item is ', item);
    item.setParent(parent);
    // todo
    // if (node.config && item instanceof TypeElement) { // new 时已经传过了。
    //   item.setConfig(node.config);
    // }
    if (node.propObj) {
      if (item instanceof TypeElement) {
        item.addStyleObj(node.propObj.styleObj);
        item.addAttrObj(node.propObj.attrObj);
      } else {
        throw Error('TextNode propObj is undefined . ');
      }
    }
    // XElement时，可以单独传nodeName.
    if (node.nodeName) {
      item.nodeName = node.nodeName;
      item.dom = document.createElement(this.nodeName);
    }
    if (node.childNodes) {
      if (item.childNodes !== undefined) {
        if (item instanceof TypeElement) {
          item.childNodes = item.createItems(item, node.childNodes);
        } else {
          throw Error('item is TextNode , do not have childNodes . ');
        }
      } else {
        throw Error('TypeClass is TextNode, but has childNodes . ');
      }
    }
    return item;
  }
  // createItems(parent: TypeElement, nodes: ITypeNode[]): TypeNode[] {
  //   const items: TypeNode[] = [];
  //   for (const node of nodes) {
  //     if (node.TypeClass === undefined) {
  //       console.error('node.TypeClass is undefined . ');
  //       continue;
  //     }
  //     const item = this.createItem(parent, node);
  //     if (item) {
  //       items.push(item);
  //     }
  //   }
  //   return items;
  // }
  /**
   * 生命周期
   * beforeRender 渲染前
   * render 渲染
   * afterRedner 渲染后
   */
  beforeRender?(): void;
  /**
   * 渲染方法
   * 要调用 this.clearChildDom
   * WebPage要另外处理
   */
  render(): void {
    // console.log('this.styleObj is ', this.styleObj);
    this.beforeRender && this.beforeRender();
    this.setStyleObj(this.styleObj);
    this.setAttrObj(this.attrObj);
    this.clearChildDom();
    // children/childNodes可能是不一样的。
    // 如CollapsibleBox中，contents重新赋值后，children会变，而childNodes是不变的。
    for (const child of this.children) {
      // this.dom.appendChild(child.render().dom);
      this.renderChild(child);
    }
    // console.log('this.dom is ', this.dom);
    this.afterRender && this.afterRender();
    this.initEvents && this.initEvents();
  }
  afterRender?(): void;
}
