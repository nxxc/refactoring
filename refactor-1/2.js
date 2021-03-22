const plays = require('./data/plays.json');
const invoices = require('./data/invoices.json');

function amountFor(perf, play) {
  //값이 바뀌지 않는 변수는 매개변수로 전달
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;

    default:
      throw new Error(`알수없는 장르 :${play.type}`);
  }
  return thisAmount; // 함수 안에서 값이 바뀌는 변수 반환
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0; //포인트
  let result = `청구 내역 (고객명 :${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);

    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);

    result += `${play.name} : ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액 : ${format(totalAmount / 100)}\n`;
  result += `포인트 : ${volumeCredits}점`;
  return result;
}

console.log(statement(invoices[0], plays));
