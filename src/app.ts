// 第三方模块
import bodyParser from 'body-parser';
import express from 'express';
import { NextFunction, Request, Response } from 'express'; // express 申明文件定义的类型

// 自定义模块

import { INotification, IMetric, ILable, IDingtalkMessage } from "./types/model";

import { ENV } from "./config"

const app = express();
const axios = require('axios').default;

// 处理 post 请求的请求体，限制大小最多为 20 兆
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  return res.sendStatus(500);
});

app.listen(ENV.port, function () {
  console.log(`the server is start at port ${ENV.port}`);
});

app.post("/send", function (req, res) {
  let notification: INotification = req.body
  let metrics: Array<IMetric> = parseValueString(notification.alerts[0].valueString)
  let { title } = notification
  let { startsAt, endsAt, silenceURL } = notification.alerts[0]
  let { instance, job } = metrics[0].labels
  let warnValue: string = notification.commonAnnotations.description

  if (notification.commonLabels.alertname === 'Slow SQl') {
    warnValue = metrics.filter(e => e.value >= 10)
      .map(e => (e.labels as ILable).sql_text)
      .join(",")
  }

  const message: IDingtalkMessage = {
    msgtype: "markdown", markdown: {
      title: title, text:
        `<font color=#FF0000 size=6 face="黑体">状态: ${notification.status} </font>        
        **发生时间**:  ${startsAt}   
        **机器**: ${instance} - ${job}      
        **问题**: ${title}      
        **报警值**: ${warnValue}  \n  
        [报警链接 内网ONLY](${silenceURL})
        `
    }
  }

  dingtalkMessage(message).then(data => {
    res.send(data)
  }).catch(err => {
    console.error(`发送失败：${err}`)
    res.send(`{code:1,message:"发送失败"}`)
  })

})


function dingtalkMessage(message: IDingtalkMessage) {
  return axios.post(ENV.dingtalkUrl, message)
    .then(function (response) {
      console.log(`response----------------------${JSON.stringify(response.data)}`)
      return response.data
    })
    .catch(function (error) {
      console.log(`error----------------------${error}`)
      return error
    })
}


function parseValueString(valueString) {
  let resultValues: Array<IMetric> = [];
  for (let match of valueString.matchAll(/\[\s*(var|metric)='([^']+)'\s+labels={([^}]*)}\s+value=([^\s]+)\s*\]/g)) {
    let value: IMetric = {
      type: match[1],
      metric: match[2],
      labels: { instance: "", job: "" },
      value: parseFloat(match[4])
    };
    if (match[3].length > 0) {
      for (let labelPair of match[3].split(",")) {
        let labelParts = labelPair.split("=");
        if (labelParts.length === 2) {
          value.labels[labelParts[0].trim()] = labelParts[1].trim();
        }
      }
    }

    resultValues.push(value);
  }
  return resultValues;
}
export default app;