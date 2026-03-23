// 入力エリアを表示する関数
function showInputUI() {
    document.getElementById('word-ui').style.display = 'block';
}

// 判定ボタンを押した時の処理
async function submitWord() {
    const input = document.getElementById('word-input');
    const word = input.value.trim();
    const resultDiv = document.getElementById('judge-result');
    
    // 1. 文字数判定（拗音・促音対応）
    const charCount = [...word].length;
    if (charCount !== currentNum) {
        resultDiv.textContent = `${currentNum}文字で入力してください！（今は${charCount}文字）`;
        return;
    }

    // 2. AI判定（ここにAIへの通信処理が入ります）
    resultDiv.textContent = "判定中...";
    
    // ※ここにVercelなどのAPIを呼び出すfetch処理が入ります
    // const result = await fetch('/api/judge', { ... });
    
    // 一旦「OK」として進める処理（テスト用）
    alert("OK! 次のプレイヤーへ");
    
    // 終了処理
    input.value = "";
    document.getElementById('word-ui').style.display = 'none';
    // 次のプレイヤーに回すロジック（onSideClickを再利用など）
}
