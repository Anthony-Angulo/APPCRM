export interface Event {
    title: string,
    description: string,
    startTime: string,
    endTime: string,
    allDay: boolean,
    event_priority_id: string,
};

export interface EventPriority {
    id: number,
    name: string
};