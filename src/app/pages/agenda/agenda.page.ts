import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { SaveDataService } from 'src/app/services/save-data.service';
import { StorageService, Event, EventPriority } from 'src/app/services/storage.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (date < current);
  };

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  event: Event;
 
  collapseCard: boolean = true;
  minDate = new Date().toISOString();
 
  eventSource = [];
  newEvents = [];
  viewTitle;
  priorityList: EventPriority[] = [];
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
 
  constructor(
    private alertCtrl: AlertController,
    private savedataservice: SaveDataService,
    private storageservice: StorageService,
    @Inject(LOCALE_ID) private locale: string) { }
 
  ngOnInit() {
    this.resetEvent();
    this.storageservice.getEvents().then(eventList => {
      this.eventSource = eventList;
      this.myCal.loadEvents();
    })
    this.storageservice.getEventsPriority().then(priorityList=>{
      this.priorityList=priorityList;
    })
  }
 
  ngOnDestroy(){
    if(this.newEvents.length > 0){
      this.storageservice.setEvents(this.eventSource);
      this.storageservice.getUserID().then(val=>{
        this.savedataservice.saveEvents(this.newEvents, val);
      })
    }
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      priority: '1',
    };
  }
 

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(Date.parse(this.event.startTime)),
      endTime: new Date(Date.parse(this.event.endTime)),
      allDay: this.event.allDay,
      desc: this.event.desc,
      priority: this.event.priority,
      status: 'New'
    }

    if (eventCopy.allDay) {
      eventCopy.startTime.setHours(0,0,0)
      eventCopy.endTime.setHours(12,59,0)
    }
 
    this.eventSource.push(eventCopy);
    this.newEvents.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }

   // Change current month
 next() {
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slideNext();
  }
  
  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
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
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
  
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: 'Status:' + event.status ,
      message: 'Prioridad:' + this.priorityList.find(priority=>priority.id == event.priority).name + '<br><br>' + event.desc + '<br><br>From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

}