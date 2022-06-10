import { MD5 } from 'crypto-js';
import moment from 'moment';

export const generateAuthorizationCode = (message: string, d: Date = new Date(), interval: number = 5): string => {
    d.setMinutes(d.getMinutes() - (d.getMinutes() % interval));
    d.setSeconds(0);
    const md5Hash = MD5(moment(d).format('YYYYMMDDHH:mm:ss') + message).toString();
    const code = md5Hash.substring(md5Hash.length - 8, md5Hash.length);
    return code.toUpperCase();
};