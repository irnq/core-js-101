/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const param = JSON.parse(json);
  Object.setPrototypeOf(param, proto);
  return param;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  stringify() {
    const string = `${this.el || ''}${this.ID || ''}${this.CLASS || ''}${this.ATTR || ''}${this.PClass || ''}${this.PElement || ''}`;
    this.clearValue();
    return string;
  },

  clearValue() {
    Object.keys(this).forEach((key) => {
      if (typeof this[key] === 'string') {
        this[key] = null;
      }
    });
  },


  element(value) {
    const temp = { ...this };
    if (temp.PElement || temp.PClass || temp.ATTR || temp.CLASS || temp.ID) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (temp.el) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    temp.el = value;
    return temp;
  },

  id(value) {
    const temp = { ...this };
    if (temp.PElement || temp.PClass || temp.ATTR || temp.CLASS) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (temp.ID) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    temp.ID = `#${value}`;
    return temp;
  },

  class(value) {
    const temp = { ...this };
    if (temp.PElement || temp.PClass || temp.ATTR) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    temp.CLASS = temp.CLASS ? `${temp.CLASS}.${value}` : `.${value}`;
    return temp;
  },

  attr(value) {
    const temp = { ...this };
    if (temp.PElement || temp.PClass) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    temp.ATTR = `[${value}]`;
    return temp;
  },

  pseudoClass(value) {
    const temp = { ...this };
    if (temp.PElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    temp.PClass = temp.PClass ? `${temp.PClass}:${value}` : `:${value}`;
    return temp;
  },

  pseudoElement(value) {
    const temp = { ...this };
    if (temp.PElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    temp.PElement = `::${value}`;
    return temp;
  },

  combine(selector1, combinator, selector2) {
    const result = {
      str: `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
      stringify() {
        return this.str;
      },
    };
    return result;
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
