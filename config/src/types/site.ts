import Xpath from "./xpath";

export default interface Site{
    url:string;
    separator:string;
    paths:Xpath[];
}