import { useState } from 'react';
import { MESSAGES } from './messages';

const GEISHI_DATE = new Date(2025, 5, 21); // 月は0始まり注意
const TOJI_DATE = new Date(2025, 11, 21);

function getPhotoList() {
  // ビルド時に全画像リストを埋める or API叩くのが理想
  // サンプル：public/sunsets/にファイルを手動でリスト化
  return [
    "20250703_104322.jpg",
    "20250704_181000.jpg",
    // ...他ファイル
  ];
}

function parsePhotoDate(filename) {
  // "20250703_104322.jpg" → Date
  const dateStr = filename.split('_')[0];
  const yyyy = parseInt(dateStr.slice(0, 4), 10);
  const mm = parseInt(dateStr.slice(4, 6), 10) - 1;
  const dd = parseInt(dateStr.slice(6, 8), 10);
  return new Date(yyyy, mm, dd);
}

function daysFromGeishi(photoDate) {
  return Math.floor((photoDate - GEISHI_DATE) / (1000 * 60 * 60 * 24));
}

export default function App() {
  const [page, setPage] = useState('start');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [messageIdx, setMessageIdx] = useState(0);

  const photoList = getPhotoList();
  const maxDays = Math.floor((TOJI_DATE - GEISHI_DATE) / (1000 * 60 * 60 * 24));

  function startGame() {
    const idx = Math.floor(Math.random() * photoList.length);
    setSelectedPhoto(photoList[idx]);
    setGuess('');
    setResult(null);
    setPage('game');
  }

  function handleGuess() {
    const photoDate = parsePhotoDate(selectedPhoto);
    const correct = daysFromGeishi(photoDate);
    const diff = Math.abs(Number(guess) - correct);
    setResult({
      photoDate: photoDate,
      correct,
      diff
    });
  }

  // JSXレンダリング
  if (page === 'start') {
    return (
      <div>
        <h1>夕焼けクイズアプリ</h1>
        <button onClick={startGame}>はじめる</button>
        <button onClick={() => {setMessageIdx(Math.floor(Math.random()*MESSAGES.length)); setPage('message')}}>
          作者メッセージ
        </button>
      </div>
    );
  }

  if (page === 'game') {
    return (
      <div>
        <h2>夕焼け写真クイズ</h2>
        {selectedPhoto && (
          <img src={`/sunsets/${selectedPhoto}`} alt="sunset" style={{maxWidth: "100%"}} />
        )}
        <div>
          夏至から何日後？　
          <input
            type="number"
            min={0}
            max={maxDays}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            style={{width: 60}}
          /> 日
          <button onClick={handleGuess} disabled={guess === ''}>決定</button>
        </div>
        {result && (
          <div>
            <div>
              【正解】{result.photoDate.toLocaleDateString()}（夏至から{result.correct}日後）
            </div>
            <div>
              あなたの答えとの差：{result.diff}日
            </div>
          </div>
        )}
        <div style={{marginTop:20}}>
          <button onClick={startGame}>もう一回</button>
          <button onClick={() => setPage('start')}>戻る</button>
          <button onClick={() => {setMessageIdx(Math.floor(Math.random()*MESSAGES.length)); setPage('message')}}>
            作者メッセージ
          </button>
        </div>
      </div>
    );
  }

  if (page === 'message') {
    return (
      <div>
        <h2>作者メッセージ</h2>
        <div>{MESSAGES[messageIdx]}</div>
        <button onClick={() => setPage('start')}>戻る</button>
      </div>
    );
  }
  return null;
}
