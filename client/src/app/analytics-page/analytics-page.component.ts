import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from '../shared/services/analytics.service'
import {AnalyticsPage} from '../shared/interfaces'
import {MaterialService} from '../shared/classes/material.service'
import {Chart} from 'chart.js'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements
  AfterViewInit,
  OnDestroy
{

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  average: number
  pending = true

  aSub: Subscription

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgba(255, 99, 132)'
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgba(54, 162, 235)'
    }

   this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
     this.average = data.average

     gainConfig.labels = data.chart.map(item => item.label)
     gainConfig.data = data.chart.map(item => item.gain)

     orderConfig.labels = data.chart.map(item => item.label)
     orderConfig.data = data.chart.map(item => item.order)

              // **** temp ****
     // gainConfig.labels.push('13.05.2020')
     // gainConfig.data.push(9999999500)
     // gainConfig.labels.push('14.05.2020')
     // gainConfig.data.push(1500)
              // **** temp ****

     // gain
     const gainCtx = this.gainRef.nativeElement.getContext('2d')
     gainCtx.canvas.height = '300px'
     new Chart(gainCtx, createChartConfig(gainConfig))

     // order
     const orderCtx = this.orderRef.nativeElement.getContext('2d')
     orderCtx.canvas.height = '300px'
     new Chart(orderCtx, createChartConfig(orderConfig))

    },() => {
      MaterialService.toast('Что-то пошло не так')
    }, () => {
      this.pending = false
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    option: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
