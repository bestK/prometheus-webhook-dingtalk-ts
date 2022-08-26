
import { IAlert } from "./alert"

export interface INotification {
    version: String;
    groupKey: string;
    status: string;
    receiver: string;
    groupLabels: string;
    commonAnnotations: string;
    externalURL: string;
    alerts: IAlert[];
}