export type DeliverySec = {
    datafrm: string;
    vdcode: string;
    vdname: string;
    plan_item: number;
    plan_qty: number;
    act_item: number;
    act_qty: number;
    diff_item: number;
    diff_qty: number;
    inchange_code: string;
    inchange_name: string;
}
export type DeliSecDetail = {
    datafrm: string;
    vdcode: string;
    vdname: string;
    partno: string;
    cm: string;
    partname: string;
    plan_qty: number;
    act_qty: number;
    diff_qty: number;
    capacity: number;
    delicycle: string;
    timesech: string;
    acttime: string;
    poremain: number;
}