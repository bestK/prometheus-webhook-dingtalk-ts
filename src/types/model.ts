export interface IMarkdown {
    title: string;
    text: string;
}

export interface IDingtalkMessage {
    msgtype: string;
    markdown: IMarkdown;
}


export interface INotification {
    title: string
    version: string
    groupKey: string
    status: string
    receiver: string
    groupLabels: string
    commonAnnotations: ICommonAnnotations
    commonLabels: ICommonLabels
    externalURL: string
    alerts: IAlert[]
}

export interface ICommonAnnotations {
    description: string
}

export interface ICommonLabels {
    alertname: string
}

export interface IAlert {
    status: string;
    lable: string;
    annotations: {};
    valueString: string;
    silenceURL: string;
    startsAt: Date;
    endsAt: Date;
}

export interface IMetric {
    type: string;
    metric: string;
    labels: { instance: string, job: string };
    value: Number;
}

export interface ILable {
    __name__: string;
    instance: string;
    job: string;
    last_call_et: number;
    logon_time: string;
    machine: string;
    sql_text: string;
    status: string;
    username: string;
}


export interface INotification {
    version: string;
    groupKey: string;
    status: string;
    receiver: string;
    groupLabels: string;
    commonAnnotations: string;
    externalURL: string;
    alerts: IAlert[];
}