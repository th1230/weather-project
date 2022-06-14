import axios from "axios";

function getMoment(location = "臺北市") {
  let formatTime = new Intl.DateTimeFormat("zh-tw", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format();

  let dateArr = formatTime.split("/");

  let now = dateArr.join("-");
  dateArr[2] = dateArr[2] * 1 + 1;
  let tomorrow = dateArr.join("-");

  return axios
    .get(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-441A7FF7-1E77-4BED-952D-BBE034D94E2D&limit=1&format=JSON&locationName=${location}&timeFrom=${now}&timeTo=${tomorrow}&sort=`
    )
    .then((res) => {
      let location = res.data.records.locations.location;
      let momentObj = location[0]?.time[0]?.parameter
        .filter((current) => {
          return ["日出時刻", "日沒時刻"].includes(current.parameterName);
        })
        .reduce((prev, current) => {
          if (current.parameterName.includes("日出")) {
            prev["sunrise"] = current.parameterValue;
          } else {
            prev["sunset"] = current.parameterValue;
          }

          return prev;
        }, {});

      if (momentObj) {
        const sunriseTimestamp = new Date(
          `${formatTime} ${momentObj.sunrise}`
        ).getTime();
        const sunsetTimestamp = new Date(
          `${formatTime} ${momentObj.sunset}`
        ).getTime();
        const nowTimeStamp = Date.now();
        return sunriseTimestamp <= nowTimeStamp &&
          nowTimeStamp <= sunsetTimestamp
          ? "day"
          : "night";
      } else {
        return "day";
      }
    });
}

export default getMoment;
