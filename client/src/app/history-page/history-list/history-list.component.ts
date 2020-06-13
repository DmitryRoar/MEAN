import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Order} from '../../shared/interfaces'
import {MaterialInit, MaterialService} from '../../shared/classes/material.service'

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements AfterViewInit,
  OnDestroy {
  @Input() orders: Order[]
  @ViewChild('modal') modalRef: ElementRef

  selectedOrder: Order
  modal: MaterialInit

  constructor() {
  }

  computePrice(order: Order): number {
    return order.list.reduce((acc, item) => {
      return acc += item.quantity * item.cost
    }, 0)
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }
}
