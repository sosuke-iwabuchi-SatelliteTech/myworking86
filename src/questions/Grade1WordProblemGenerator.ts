import { Question } from '../types';
import { QuestionGenerator } from './QuestionGenerator';

type ProblemTemplate = {
  generate: () => { text: string; answer: number; };
};

export class Grade1WordProblemGenerator implements QuestionGenerator {
  private templates: ProblemTemplate[] = [
    // 1. [足し算] 合わせていくつ（小）
    {
      generate: () => {
        const a = this.getRandomInt(2, 9);
        const b = this.getRandomInt(1, 9);
        return {
          text: `りんごが ${a}こ、みかんが ${b}こ あります。\nあわせて なんこですか。`,
          answer: a + b
        };
      }
    },
    // 2. [足し算] 増えるといくつ（小）
    {
      generate: () => {
        const a = this.getRandomInt(2, 8);
        const b = this.getRandomInt(1, 5);
        return {
          text: `バスに ${a}にん のっています。\n${b}にん のってきました。\nみんなで なんにんですか。`,
          answer: a + b
        };
      }
    },
    // 3. [引き算] 残りはいくつ（小）
    {
      generate: () => {
        const a = this.getRandomInt(5, 15);
        const b = this.getRandomInt(1, a - 1);
        return {
          text: `クッキーが ${a}まい あります。\n${b}まい たべました。\nのこりは なんまいですか。`,
          answer: a - b
        };
      }
    },
    // 4. [引き算] 違いはいくつ（小）
    {
      generate: () => {
        const a = this.getRandomInt(5, 15);
        const b = this.getRandomInt(1, a - 1);
        return {
          text: `あかチームは ${a}てん、しろチームは ${b}てんです。\nあかチームは なんてん おおいですか。`,
          answer: a - b
        };
      }
    },
    // 5. [足し算] お金（合計）
    {
      generate: () => {
        const a = this.getRandomInt(1, 9) * 10;
        const b = this.getRandomInt(1, 9) * 10;
        return {
          text: `${a}えんの パンと、${b}えんの ジュースを かいました。\nあわせて いくらですか。`,
          answer: a + b
        };
      }
    },
    // 6. [引き算] お金（おつり）
    {
      generate: () => {
        const price = this.getRandomInt(1, 9) * 10;
        // 支払うお金は価格より高い切りの良い数字 (100, 500, 1000など)
        const paymentOptions = [50, 100, 500, 1000].filter(p => p > price);
        const payment = this.pick(paymentOptions);
        return {
          text: `${price}えんの おかしを かいます。\n${payment}えん だしました。\nおつりは いくらですか。`,
          answer: payment - price
        };
      }
    },
    // 7. [引き算] お金（残り）
    {
      generate: () => {
        const total = this.getRandomInt(5, 10) * 10;
        const used = this.getRandomInt(1, 4) * 10;
        return {
          text: `${total}えん もっています。\n${used}えん つかいました。\nのこりは いくらですか。`,
          answer: total - used
        };
      }
    },
    // 8. [足し算] 年齢
    {
      generate: () => {
        const me = this.getRandomInt(6, 8);
        const diff = this.getRandomInt(2, 5);
        return {
          text: `わたしは ${me}さいです。\nおにいさんは ${diff}さい うえです。\nおにいさんは なんさいですか。`,
          answer: me + diff
        };
      }
    },
    // 9. [引き算] 本のページ（残り）
    {
      generate: () => {
        const total = this.getRandomInt(10, 30);
        const read = this.getRandomInt(1, total - 1);
        return {
          text: `ほんが ぜんぶで ${total}ページ あります。\nきょう ${read}ページ よみました。\nあと なんページですか。`,
          answer: total - read
        };
      }
    },
    // 10. [足し算] 長さ（合わせる）
    {
      generate: () => {
        const a = this.getRandomInt(5, 15);
        const b = this.getRandomInt(5, 15);
        return {
          text: `${a}cmの テープと ${b}cmの テープを つなげました。\nながさは なんcmですか。`,
          answer: a + b
        };
      }
    },
    // 11. [引き算] 長さ（切り取る）
    {
      generate: () => {
        const total = this.getRandomInt(15, 30);
        const cut = this.getRandomInt(5, 10);
        return {
          text: `${total}cmの リボンが あります。\n${cut}cm つかいました。\nのこりは なんcmですか。`,
          answer: total - cut
        };
      }
    },
    // 12. [足し算] 時間
    {
      generate: () => {
        const start = this.getRandomInt(1, 9);
        const duration = this.getRandomInt(1, 12 - start);
        return {
          text: `いま ${start}じです。\n${duration}じかん あそぶと なんじですか。`,
          answer: start + duration
        };
      }
    },
    // 13. [足し算] 拾った
    {
      generate: () => {
        const a = this.getRandomInt(5, 15);
        const b = this.getRandomInt(5, 15);
        return {
          text: `どんぐりを ${a}こ ひろいました。\nまた ${b}こ ひろいました。\nぜんぶで なんこですか。`,
          answer: a + b
        };
      }
    },
    // 14. [引き算] あげた
    {
      generate: () => {
        const total = this.getRandomInt(10, 20);
        const give = this.getRandomInt(1, 5);
        return {
          text: `シールを ${total}まい もっています。\nともだちに ${give}まい あげました。\nのこりは なんまいですか。`,
          answer: total - give
        };
      }
    },
    // 15. [足し算] 動物
    {
      generate: () => {
        const a = this.getRandomInt(2, 9);
        const b = this.getRandomInt(2, 9);
        return {
          text: `いぬが ${a}びき、ねこが ${b}びき います。\nあわせて なんびきですか。`,
          answer: a + b
        };
      }
    },
    // 16. [引き算] 帰った
    {
      generate: () => {
        const total = this.getRandomInt(5, 15);
        const leave = this.getRandomInt(1, total - 1);
        return {
          text: `こうえんで ${total}にん あそんでいます。\n${leave}にん かえりました。\nのこりは なんにんですか。`,
          answer: total - leave
        };
      }
    },
    // 17. [足し算] 本（合計）
    {
      generate: () => {
        const a = this.getRandomInt(2, 8);
        const b = this.getRandomInt(2, 8);
        return {
          text: `としょしつで ${a}さつ、きょうしつで ${b}さつ ほんを かりました。\nぜんぶで なんさつですか。`,
          answer: a + b
        };
      }
    },
    // 18. [引き算] 席
    {
      generate: () => {
        const total = this.getRandomInt(10, 30);
        const sit = this.getRandomInt(5, total - 1);
        return {
          text: `いすが ${total}こ あります。\n${sit}にん すわりました。\nあいている いすは なんこですか。`,
          answer: total - sit
        };
      }
    },
    // 19. [足し算] 花
    {
      generate: () => {
        const a = this.getRandomInt(3, 12);
        const b = this.getRandomInt(3, 12);
        return {
          text: `かだんに あかいはなが ${a}ほん、\nしろいはなが ${b}ほん さきました。\nぜんぶで なんぼんですか。`,
          answer: a + b
        };
      }
    },
    // 20. [引き算] 牛乳
    {
      generate: () => {
        const total = this.getRandomInt(20, 35);
        const drink = this.getRandomInt(15, total - 1);
        return {
          text: `ぎゅうにゅうが ${total}ほん あります。\nきゅうしょくで ${drink}ほん のみました。\nのこりは なんぼんですか。`,
          answer: total - drink
        };
      }
    }
  ];

  generate(): Question {
    const template = this.pick(this.templates);
    const problem = template.generate();

    // お金の問題なら選択肢の幅を広げる（10円単位など）
    const isMoneyProblem = problem.text.includes('えん');
    const options = this.generateOptions(problem.answer, isMoneyProblem);

    return {
      text: problem.text,
      correctAnswer: problem.answer,
      options: options,
    };
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  private generateOptions(answer: number, isMoneyProblem: boolean): number[] {
    const options = new Set([answer]);

    // お金の問題の場合は、10, 50, 100などの単位で変動させるとより自然
    // 通常の問題は±1〜5程度の変動

    let attempts = 0;
    while (options.size < 4 && attempts < 20) {
      attempts++;
      let offset: number;

      if (isMoneyProblem) {
        // 10, 20... or 100, 200...
        const scale = answer >= 100 ? 10 : 10;
        offset = this.getRandomInt(1, 5) * scale;
      } else {
        offset = this.getRandomInt(1, 5);
      }

      if (Math.random() > 0.5) offset = -offset;

      const wrong = answer + offset;

      if (wrong > 0 && wrong !== answer) {
        options.add(wrong);
      }
    }

    // もし4つ埋まらなかったら適当に埋める
    while (options.size < 4) {
      const wrong = answer + this.getRandomInt(1, 10);
      if (wrong !== answer) options.add(wrong);
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
  }
}
