import timekeepingServices from "../services/timekeeping";
import shiftUserServices from "../services/shiftUser";

async function getTardinessReport() {
  const getTimeKeepings = await timekeepingServices.list();
  const getShiftUser = await shiftUserServices.list();

  await Promise.all([getTimeKeepings, getShiftUser]).then(
    ([timekeepings, shiftUsers]) => {
      const data = timekeepings.map((time) => ({
        ...time,
        shifts: shiftUsers.filter(
          (s) =>
            s.employee_id === time.employee.id &&
            (s.employee.part_time ? s.date === time.term : true)
        ),
        groupKey: `${time.employee.id}-${time.term}`,
      }));
      const groupKeys = [...new Set(data.map((d) => d.groupKey))];
      const newTimekeepings = groupKeys.map((k) => {
        const datas = data.filter((d) => d.groupKey === k);
        const checkin = {
          checkin: datas.map((d) => d.checkin.time)[0],
          isLate: convertReport(
            "start",
            datas.map((d) => d.shifts)[0][0],
            datas.map((d) => d.checkin.time)[0]
          ),
        };
        if (datas.length > 1) {
          return {
            ...datas[0],
            allCheckins: datas,
            times: [
              checkin,
              {
                checkout: datas.map((d) => d.checkin.time).slice(-1)[0],
                isSoon: convertReport(
                  "end",
                  datas.map((d) => d.shifts)[0][0],
                  datas.map((d) => d.checkin.time).slice(-1)[0]
                ),
              },
            ],
          };
        }
        return {
          ...datas[0],
          times: [checkin],
        };
      });
      console.log(newTimekeepings);
    }
  );
}

function convertReport(type, shift, time) {
  if (type === "start") {
    if (time > shift.shift.started_at) {
      return true;
    }
    return false;
  }
  if (time < shift.shift.ended_at) {
    return true;
  }
  return false;
}

export { getTardinessReport };
