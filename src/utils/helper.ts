import os from 'os';

export class Helper {
  static formatDates = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (obj instanceof Date) {
      return obj.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false
      }).split(' ')[1];
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.formatDates(item))
    }
    if (typeof obj === 'object') {
      const formatted = {};
      for (const key in obj) {
        formatted[key] = this.formatDates(obj[key])
      }
      return formatted;
    }
    return obj;
  }

  static getImageUrl = (filePath: string) => {
    if (filePath && !filePath.startsWith('http')) {
        const API_PREFIX = `http://localhost:${process.env.PORT || 3000}/api/v1`;
        return `${API_PREFIX}/image/${filePath}`;
    }
    return filePath;
  }
}

export default Helper;