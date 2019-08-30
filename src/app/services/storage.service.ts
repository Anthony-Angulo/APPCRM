import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contact } from '../models/contact';
import { Event, EventPriority } from '../models/event'

const ORDERS_KEY = 'orders';
const CONTACTS_KEY = 'contacts';
const EVENTS_KEY = 'events';
const PRIORITY_EVENTS_KEY = 'events_priority';
const COTIZACIONES_KEY = 'cotizaciones';
const PRODUCTS_KEY = 'products';
const SUCURSAL_KEY = 'sucursal';
const IMPUESTOS_KEY = 'impuestos';
const TES_KEY = 'tes';
const CAMBIO_KEY = 'cambio';
const PAGO_KEY = 'pago';
const RUTAS_KEY = 'rutas';
const DOCUMENTS_KEY = 'documents';
const CURRENCY_KEY = 'currency';
const HORAS_KEY = 'horas';
const USER_ID_KEY = 'USER_ID';
const USER_NAME_KEY = 'USER_NAME';
const TOKEN_KEY = 'TOKEN_KEY';
const ONESIGNAL_REGISTER = 'register';
const STORAGE_ORDER_KEY = 'order_pendings';
const STORAGE_GEO_KEY = 'geo';
const STORAGE_EVENTS_KEY = 'events_pendings';
const STORAGE_TRACK_KEY = 'track_pendings';
const NOTIFICATIONS_KEY = 'notifications';
const STATUS_KEY = 'status';
const CHECK_IN = 'check-in';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  getStatus(): Promise<any[]> {
    return this.storage.get(STATUS_KEY)
  }

  setStatus(status: any[]) {
    this.storage.set(STATUS_KEY, status);
  }

  getEvents(): Promise<Event[]> {
    return this.storage.get(EVENTS_KEY)
  }

  setEvents(events: Event[]) {
    this.storage.set(EVENTS_KEY, events);
  }

  getEventsPriority(): Promise<EventPriority[]> {
    return this.storage.get(PRIORITY_EVENTS_KEY)
  }

  setEventsPriority(priority: EventPriority[]) {
    this.storage.set(PRIORITY_EVENTS_KEY, priority);
  }

  async getOrders(): Promise<any[]> {
    return await this.storage.get(ORDERS_KEY)
  }

  async setOrders(orders: any) {
    return await this.storage.set(ORDERS_KEY, orders)
  }

  getContacts(): Promise<Contact[]> {
    return this.storage.get(CONTACTS_KEY)
  }

  setContacts(contacts: Contact[]) {
    this.storage.set(CONTACTS_KEY, contacts)
  }

  getNotifications(): Promise<any[]> {
    return this.storage.get(NOTIFICATIONS_KEY)
  }

  setNotifications(notifications: any[]) {
    this.storage.set(NOTIFICATIONS_KEY, notifications)
  }

  getCheckIn(): Promise<any> {
    return this.storage.get(CHECK_IN)
  }

  setCheckIn(status: boolean) {
    this.storage.set(CHECK_IN, status)
  }

  getRegisterOneSignal(): Promise<any> {
    return this.storage.get(ONESIGNAL_REGISTER)
  }

  setRegisterOneSignal(register: any) {
    this.storage.set(ONESIGNAL_REGISTER, register)
  }

  getCotizaciones(): Promise<any[]> {
    return this.storage.get(COTIZACIONES_KEY)
  }

  setCotizaciones(cotizaciones: any[]) {
    this.storage.set(COTIZACIONES_KEY, cotizaciones)
  }

  getProducts(): Promise<any[]> {
    return this.storage.get(PRODUCTS_KEY)
  }

  setProducts(products: any[]) {
    this.storage.set(PRODUCTS_KEY, products)
  }

  getSucursales(): Promise<any[]> {
    return this.storage.get(SUCURSAL_KEY)
  }

  setSucursales(sucursales: any[]) {
    this.storage.set(SUCURSAL_KEY, sucursales)
  }

  getCambio(): Promise<number> {
    return this.storage.get(CAMBIO_KEY)
  }

  setCambio(cambio: number) {
    this.storage.set(CAMBIO_KEY, cambio)
  }

  getTes(): Promise<any[]> {
    return this.storage.get(TES_KEY)
  }

  setTes(tes: any[]) {
    this.storage.set(TES_KEY, tes)
  }

  getImpuestos(): Promise<any[]> {
    return this.storage.get(IMPUESTOS_KEY)
  }

  setImpuestos(impuestos: any[]) {
    this.storage.set(IMPUESTOS_KEY, impuestos)
  }

  getHoras(): Promise<any[]> {
    return this.storage.get(HORAS_KEY)
  }

  setHoras(horas: any[]) {
    this.storage.set(HORAS_KEY, horas)
  }

  getCurrency(): Promise<any[]> {
    return this.storage.get(CURRENCY_KEY)
  }

  setCurrency(currency: any[]) {
    this.storage.set(CURRENCY_KEY, currency)
  }

  getDocuments(): Promise<any[]> {
    return this.storage.get(DOCUMENTS_KEY)
  }

  setDocuments(documents: any[]) {
    this.storage.set(DOCUMENTS_KEY, documents)
  }

  getRutas(): Promise<any[]> {
    return this.storage.get(RUTAS_KEY)
  }

  setRutas(rutas: any[]) {
    this.storage.set(RUTAS_KEY, rutas)
  }

  getPagos(): Promise<any[]> {
    return this.storage.get(PAGO_KEY)
  }

  setPagos(pagos: any[]) {
    this.storage.set(PAGO_KEY, pagos)
  }

  getUserID() {
    return this.storage.get(USER_ID_KEY);
  }

  setUserID(id: number) {
    return this.storage.set(USER_ID_KEY, id);
  }

  getUsername() {
    return this.storage.get(USER_NAME_KEY);
  }

  setUsername(name: string) {
    return this.storage.set(USER_NAME_KEY, name);
  }

  getToken() {
    return this.storage.get(TOKEN_KEY);
  }

  setToken(token: string) {
    return this.storage.set(TOKEN_KEY, token);
  }

  getPendingOrders() {
    return this.storage.get(STORAGE_ORDER_KEY);
  }

  setPendingOrders(orders: any[]) {
    return this.storage.set(STORAGE_ORDER_KEY, orders);
  }

  getPendingGeoUpdate() {
    return this.storage.get(STORAGE_GEO_KEY);
  }

  setPendingGeoUpdate(geo: any[]) {
    return this.storage.set(STORAGE_GEO_KEY, geo);
  }

  getPendingEvents() {
    return this.storage.get(STORAGE_EVENTS_KEY);
  }

  setPendingEvents(events: any[]) {
    return this.storage.set(STORAGE_EVENTS_KEY, events);
  }

  getPendingTrack() {
    return this.storage.get(STORAGE_TRACK_KEY);
  }

  setPendingTrack(track: any[]) {
    return this.storage.set(STORAGE_TRACK_KEY, track);
  }

  removeToken() {
    return this.storage.remove(TOKEN_KEY);
  }
}
