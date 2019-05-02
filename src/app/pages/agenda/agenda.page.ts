import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Storage } from '@ionic/storage';
import { SaveDataService } from 'src/app/services/save-data.service';

const EVENTOS_KEY = 'events';

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

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
    priority: '1',
  };
 
  collapseCard: boolean = true;
  minDate = new Date().toISOString();
 
  eventSource = [];
  newEvents = [];
  viewTitle;
  priorityList = [];
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
 
  constructor(
    private alertCtrl: AlertController,
    private savedataservice: SaveDataService,
    private storage: Storage,
    @Inject(LOCALE_ID) private locale: string) { }
 
  ngOnInit() {
    this.resetEvent();
    this.storage.get(EVENTOS_KEY).then(val=>{
      this.eventSource = val.events;
      this.priorityList = val.priority;
      this.myCal.loadEvents();
    })
  }
 
  ngOnDestroy(){
    if(this.newEvents.length > 0){
      let events_list = {events:this.eventSource, priority:this.priorityList}
      this.storage.set(EVENTOS_KEY,events_list);
      this.storage.get('USER_ID').then(val=>{
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
 
  // Create the right event format and reload source
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
 
// Focus today
today() {
  this.calendar.currentDate = new Date();
}
 
// Selected date reange and hence title changed
onViewTitleChanged(title) {
  this.viewTitle = title;
}
changeMode(mode) {
  this.calendar.mode = mode;
}
// Calendar event was clicked
async onEventSelected(event) {
  // Use Angular date pipe for conversion
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
 
// Time slot was clicked
onTimeSelected(ev) {
  let selected = new Date(ev.selectedTime);
  this.event.startTime = selected.toISOString();
  selected.setHours(selected.getHours() + 1);
  this.event.endTime = (selected.toISOString());
}

}
