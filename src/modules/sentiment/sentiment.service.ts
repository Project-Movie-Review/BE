import { Injectable } from '@nestjs/common';
import Sentiment from 'sentiment';

@Injectable()
export class SentimentService {
  private sentimentAnalyzer: any;

  // Bộ từ điển Tiếng Việt
  private readonly posWords = ['hay', 'tuyệt', 'đỉnh', 'đẹp', 'xuất sắc', 'hấp dẫn', 'mãn nhãn', 'cuốn', 'thích', 'nổ não', 'lật kèo'];
  private readonly negWords = ['dở', 'tệ', 'chán', 'nhạt', 'phí tiền', 'thất vọng', 'kém', 'rác', 'lố', 'buồn ngủ', 'cc', 'đm', 'đéo', 'địt', 'cặc', 'lồn', 'vcl', 'vl', 'ngu'];

  constructor() {
    this.sentimentAnalyzer = new Sentiment();
  }

  analyze(text: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    const content = text.toLowerCase();
    let viScore = 0;

    // Kiểm tra từ điển Tiếng Việt trước
    this.posWords.forEach(word => {
      if (content.includes(word)) viScore += 1;
    });
    this.negWords.forEach(word => {
      if (content.includes(word)) viScore -= 1;
    });

    if (viScore > 0) return 'POSITIVE';
    if (viScore < 0) return 'NEGATIVE';

    // Kiểm tra bằng thư viện Sentiment (chủ yếu cho tiếng Anh)
    const enResult = this.sentimentAnalyzer.analyze(text);
    if (enResult.score > 0) return 'POSITIVE';
    if (enResult.score < 0) return 'NEGATIVE';

    return 'NEUTRAL';
  }
}