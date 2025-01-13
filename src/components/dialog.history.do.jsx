import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import HistoryIcon from "@mui/icons-material/History";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import {
  API_EDIT_DO,
  API_GET_HISTORY_DO,
  API_HISTORY_EDIT_DO,
} from "../Services";
import { useSelector } from "react-redux";
import { contact } from "../constant";
import { notification } from "antd";
function DialogHistoryDO(props) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message) => {
    api[type]({
      message: "แจ้งเตือน",
      description: message,
    });
  };
  const { open, close, param, runningCode, data, setData, loadDO } = props;
  const date = param.date;
  const part = param.part;
  const doVal = param.do;
  const prodLead = param.prodLead;
  const [canEditDO, setCanEditDO] = useState(false);
  const redux = useSelector((state) => state.mainReducer);
  const reduxFixDates = useSelector((state) => state.fixDateStateReducer.fixDates[state.fixDateStateReducer.fixDates.length-1]);
  const [doEdit, setDoEdit] = useState(doVal);
  const [log, setLog] = useState([]);
  const [load, setLoad] = useState(true);
  useEffect(() => {
    if (open == true) {
      init();
    }
  }, [open]);
  const init = async () => {
    setLoad(true);
    setDoEdit(doVal);
    // if (moment().add("days", prodLead).format("YYYYMMDD") >=moment(date).format("YYYYMMDD")) {
    if(moment(reduxFixDates).format("YYYYMMDD") >=moment(date).format("YYYYMMDD")){
      setCanEditDO(true);
    } else {
      setCanEditDO(false);
    }
    let doRunning = runningCode.substring(0, 8);
    let doRev = runningCode.substring(8, 11);
    let api = await API_GET_HISTORY_DO({
      logPartNo: part,
      logToDate: date,
      doRunning: doRunning,
      doRev: Number(doRev),
      logDo: doVal,
    });
    setLog(api);
    setLoad(false);
  };
  const handleEditDO = async () => {
    let doRunning = runningCode.substring(0, 8);
    if (doEdit != "") {
      let apiUpdateDOManual = await API_HISTORY_EDIT_DO({
        runningCode: doRunning,
        ymd: date,
        partno: part,
        doVal: doEdit,
        doPrev: doVal,
        empCode: redux.id,
      });
      if (apiUpdateDOManual.status == 1) {
        let dataOfResult = data.filter((o) => o.part == part && o.name == "do");
        if (dataOfResult.length) {
          let indexOfResult = data.findIndex(
            (o) => o.part == part && o.name == "do"
          );
          let oData = dataOfResult[0].data.map((o) =>
            o.date.substring(0, 10).replaceAll("-", "")
          );
          let indexData = oData.findIndex((o) => o == date);
          if (indexOfResult != -1 && indexData != -1) {
            data[indexOfResult]["data"][indexData]["value"] = doEdit;
            setData([...data]);
          }
          openNotification("success", "แก้ไขจำนวนสั่งซื้อเรียบร้อยแล้ว");
          loadDO();
        }
      } else {
        alert(`ไม่สามารถแก้ไขจำนวนสั่งซื้อได้ ${contact}`);
      }
    }
  };
  return (
    <Dialog open={open} onClose={() => close(false)} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex gap-2 flex-row items-center">
          <div className="rounded-full bg-[#5c5fc8] text-[#fff]  w-[36px] h-[36px] flex items-center justify-center">
            <HistoryIcon sx={{ fontSize: "20px" }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[18px]">History</span>
            <span className="text-[12px] text-[#939393]">
              ประวัติของตัวเลขสั่งซื้อ
            </span>
          </div>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        {contextHolder}
        <div className={`flex flex-col `}>
          <div className="flex flex-col">
            <div className="pl-3 py-2 flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <div className="flex-1 flex flex-col  gap-1  text-[14px]">
                  <span className="text-[#5f5f5f]">Part</span>
                  <div className="bg-[#f3f3f3] px-3 py-1 rounded-md font-semibold text-[#5c5fc8] border-[#5c5fc830] border">
                    {part}
                  </div>
                </div>
                <div className="flex-1 flex flex-col  gap-1  text-[14px]">
                  <span className="text-[#5f5f5f]">Date</span>
                  <div className="bg-[#f3f3f3] px-3 py-1 rounded-md font-semibold text-[#5c5fc8] border-[#5c5fc830] border">
                    {moment(date, "YYYYMMDD").format("DD/MM/YYYY")}
                  </div>
                </div>
              </div>
              <div className="flex flex-col  gap-1  text-[14px]">
                <span className="text-[#5f5f5f]">จำนวนสั่งซื้อ D/O</span>
                <div className="bg-[#f3f3f3] px-2 py-1 rounded-md font-semibold text-[#5c5fc8] border-[#5c5fc830] border">
                  {doVal != null && doVal != undefined && doVal != ""
                    ? doVal.toLocaleString("en")
                    : 0}
                </div>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div className="grow flex-1 flex flex-col  gap-1  text-[14px]">
                  <span className="text-[#5f5f5f]">
                    แก้ไขจำนวนสั่งซื้อ{" "}
                    {doEdit == "" ? (
                      ""
                    ) : doEdit > doVal ? (
                      <span className="text-green-600 font-semibold">
                        เพิ่มขึ้น
                      </span>
                    ) : doEdit != doVal ? (
                      <span className="text-red-500 font-semibold">ลดลง</span>
                    ) : (
                      ""
                    )}
                  </span>
                  <input
                    type="number"
                    className={`border rounded-md px-4 py-2 border-[#5c5fc850] duration-300 transition-border text-[#5c5fc8] font-bold font-['Inter'] focus-visible:outline-[#5c5fc8] focus-visible:bg-[#5c5fc810]`}
                    placeholder="กรอกตัวเลขจำนวนสั่งซื้อ"
                    value={doEdit}
                    autoFocus
                    onChange={(e) => setDoEdit(e.target.value)}
                  />
                </div>
                <div className="flex-none flex flex-col  gap-1  text-[14px]">
                  <span>&nbsp;</span>
                  <Button
                    variant="contained"
                    className={`${
                      doVal != doEdit && canEditDO == true && "bg-[#5c5fc8]"
                    } hover:opacity-95`}
                    disabled={
                      doVal != doEdit && canEditDO == true ? false : true
                    }
                    onClick={handleEditDO}
                  >
                    แก้ไข
                  </Button>
                </div>
              </div>
              {canEditDO == false && (
                <div className="text-red-500 text-[14px] text-end">
                  * ไม่สามารถแก้ไขจำนวนสั่งซื้อได้
                  เนื่องจากข้อมูลไม่ได้อยู่ในช่วง Fixed Date
                </div>
              )}
            </div>
            <div className="pl-3 py-2">
              {load ? (
                <div className="flex flex-col gap-2 items-center bg-[#f3f3f3] py-6 rounded-md">
                  <CircularProgress className="text-[#5c5fc8]" />
                  <span>กำลังโหลดข้อมูล ...</span>
                </div>
              ) : (
                <table className={`w-full `}>
                  <thead>
                    <tr className="bg-[#5c5fc8] text-white">
                      <td className="border text-center">แผนวันที่</td>
                      <td className="border text-center">แผนการผลิต</td>
                      <td className="border text-center">คงเหลือ</td>
                      <td className="border text-center">ความต้องการ</td>
                      <td className="border text-center">ต่อกล่อง</td>
                      <td className="border text-center">ยอดสั่งซื้อ D/O</td>
                      <td className="border text-center">ลงวันที่</td>
                      <td className="border text-center">หมายเหตุ</td>
                    </tr>
                  </thead>
                  <tbody>
                    {log.length == 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center border">
                          ไม่พบข้อมูล
                        </td>
                      </tr>
                    ) : (
                      log.map((o, i) => {
                        return (
                          <tr
                            key={i}
                            className={`${
                              o.logState == "notused" && "bg-red-50"
                            } ${
                              o.logState == "notused" &&
                              "line-through decoration-red-600"
                            }`}
                          >
                            <td className={`border text-center`}>
                              {moment(o.logFromDate, "YYYYMMDD").format(
                                "DD/MM/YYYY"
                              )}
                            </td>
                            <td className={`border text-center`}>
                              {o.logFromPlan.toLocaleString("en")}
                            </td>
                            <td className={`border text-center`}>
                              {o.logFromStock.toLocaleString("en")}
                            </td>
                            <td className={`border text-center`}>
                              {o.logNextStock.toLocaleString("en")}
                            </td>
                            <td className={`border text-center`}>{o.logBox}</td>
                            <td className={`border text-center`}>
                              {o.logDo.toLocaleString("en")}
                            </td>
                            <td className={`border text-center`}>
                              {moment(o.logNextDate, "YYYYMMDD").format(
                                "DD/MM/YYYY"
                              )}
                            </td>
                            <td className={`border text-center text-red-500`}>
                              {o.logState == "notused"
                                ? o.logRemark == "weekly"
                                  ? "วันหยุดสัปดาห์"
                                  : "วันหยุดเทศกาล"
                                : "แก้ไขยอด"}
                              {o.logState == "edit_do" && "แก้ไขจำนวนสั่งซื้อ"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                    <tr className="bg-[#5c5fc8] text-white">
                      <td className="border text-right pr-6 py-3" colSpan={5}>
                        ยอดสั่งซื้อ
                      </td>
                      <td
                        className={`border text-center font-semibold font-['Inter']`}
                      >
                        {log
                          .filter((x) => x.logState == "used")
                          .reduce((sum, item) => sum + item.logDo, 0)
                          .toLocaleString("en")}
                      </td>
                      <td className="border text-center" colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className="border-[#5c5fc8] text-[#5c5fc8]"
          variant="outlined"
          onClick={() => close(false)}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogHistoryDO;
