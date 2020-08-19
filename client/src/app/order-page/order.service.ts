import {Injectable} from '@angular/core'
import {OrderPosition, Position} from '../shared/interfaces'
import {strict} from 'assert'

@Injectable()
export class OrderService {

  list: OrderPosition[] = []
  price = 0

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })

    const candidate = this.list.find(p => {
      return p._id === orderPosition._id
    })

    if (candidate) {
      candidate.quantity += orderPosition.quantity
    } else {
      this.list.push(orderPosition)
    }

    this.computePrice()
  }

  remove(orderPosition: OrderPosition) {
    this.list = this.list.filter(p => p._id !== orderPosition._id)
    this.computePrice()
  }

  clear() {
    this.list = []
    this.price = 0
  }

  private computePrice() {
    this.price = this.list.reduce((acc, item) => {
      return acc += item.quantity * item.cost
    }, 0)
  }
}
