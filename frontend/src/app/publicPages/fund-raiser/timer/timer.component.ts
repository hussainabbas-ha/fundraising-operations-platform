import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() endDate: string = '';
  timeLeft: { ms: number, d: number, h: number, m: number, s: number } = { d: 0, h: 0, m: 0, s: 0, ms: 0 };
  intervalID: any = null;
  constructor() {
  }
  ngOnInit(): void {
    this.timeLeft.ms = moment(this.endDate).valueOf() - moment().valueOf();
    this.intervalID = setInterval(() => {
      this.setTimer();
    }, 1000);
  }
  setTimer(): void {
      if (this.timeLeft && this.timeLeft.ms > 0) {
        this.timeLeft.ms = this.timeLeft.ms - 1000;
        const duration = moment.duration(this.timeLeft.ms);
        this.timeLeft.d = Math.floor(duration.days());
        this.timeLeft.h = Math.floor(duration.hours());
        this.timeLeft.m = Math.floor(duration.minutes());
        this.timeLeft.s = Math.floor(duration.seconds());
      }
  }
  ngOnDestroy(): void {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }
}
