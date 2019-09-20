import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { SaveDataService } from 'src/app/services/save-data.service';
import { StorageService } from 'src/app/services/storage.service';
import { Event, EventPriority } from 'src/app/models/event';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit, OnDestroy {

  constructor(
    private alertCtrl: AlertController,
    private savedataservice: SaveDataService,
    private storageservice: StorageService,
    @Inject(LOCALE_ID) private locale: string) { }

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  event: Event;

  collapseCard = true;
  minDate = new Date().toISOString();

  eventSource = [];
  newEvents = [];
  viewTitle;
  priorityList: EventPriority[] = [];

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  markDisabled = (date: Date) => {
    const current = new Date();
    current.setHours(0, 0, 0);
    return (date < current);
  }

  ngOnInit() {
    this.resetEvent();
    this.storageservice.getEvents().then(eventList => {
      this.eventSource = eventList;
      this.myCal.loadEvents();
    });
    this.storageservice.getEventsPriority().then(priorityList => {
      this.priorityList = priorityList;
    });
  }

  ngOnDestroy() {
    if (this.newEvents.length > 0) {
      this.storageservice.setEvents(this.eventSource);
      this.storageservice.getUserID().then(val => {
        this.savedataservice.saveEvents(this.newEvents, val);
      });
    }
  }

  resetEvent() {
    this.event = {
      title: '',
      description: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      event_priority_id: '1',
    };
  }

  addEvent() {
    const eventCopy = {
      title: this.event.title,
      startTime: new Date(Date.parse(this.event.startTime)),
      endTime: new Date(Date.parse(this.event.endTime)),
      allDay: this.event.allDay,
      description: this.event.description,
      event_priority_id: this.event.event_priority_id,
      status: 'New'
    };

    if (eventCopy.allDay) {
      eventCopy.startTime.setHours(0, 0, 0);
      eventCopy.endTime.setHours(12, 59, 0);
    }

    this.eventSource.push(eventCopy);
    this.newEvents.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }

  // Change current month
  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }


  today() {
    this.calendar.currentDate = new Date();
  }


  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  async onEventSelected(event) {
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: 'Status:' + event.status,
      message: 'Prioridad:' + this.priorityList.find(priority => priority.id == event.event_priority_id).name + '<br><br>' + event.description + '<br><br>From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  onTimeSelected(ev) {
    const selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

}
