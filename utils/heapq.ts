export class HeapQueue<T> {
  comparator: (a: T, b: T) => number;
  elements: T[];
  size: number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
    this.elements = [];
    this.size = 0;
  }

  push(value: T) {
    this.elements.push(value);

    let currentPosition = this.elements.length - 1;
    let parentPosition;
    let temp;

    while (currentPosition > 0) {
      parentPosition = (currentPosition - 1) >>> 1;

      if (this.comparator(this.elements[currentPosition], this.elements[parentPosition]) < 0) {
        temp = this.elements[parentPosition];
        this.elements[parentPosition] = this.elements[currentPosition];
        this.elements[currentPosition] = temp;
        currentPosition = parentPosition;
      } else {
        break;
      }
    }

    return this.size++;
  }

  pop() {
    const lastValue = this.elements.pop();
    let returnValue: T | undefined = this.elements[0];

    if (this.elements.length > 0 && lastValue) {
      this.elements[0] = lastValue;
      let currentPosition = 0;
      const lastPosition = this.elements.length - 1;

      while (true) {
        const leftChild = (currentPosition << 1) + 1;
        const rightChild = leftChild + 1;
        let minIndex = currentPosition;

        if (leftChild <= lastPosition && this.comparator(this.elements[leftChild], this.elements[minIndex]) < 0) {
          minIndex = leftChild;
        }

        if (rightChild <= lastPosition && this.comparator(this.elements[rightChild], this.elements[minIndex]) < 0) {
          minIndex = rightChild;
        }

        if (minIndex !== currentPosition) {
          const temp = this.elements[minIndex];
          this.elements[minIndex] = this.elements[currentPosition];
          this.elements[currentPosition] = temp;
          currentPosition = minIndex;
        } else {
          break;
        }
      }
      this.size--;
    } else {
      returnValue = lastValue;
    }

    return returnValue;
  }
}
