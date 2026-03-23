export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    try {
        const { word, prevWord, requiredLength } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `"${word}"は直前"${prevWord}"のしりとりとして(${requiredLength}文字、実在)か？判定結果を {"is_valid": true, "reason": "OK"} のJSON形式のみで出力せよ。` }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        // 【重要】ここでJSON以外の文字も一度すべて返すようにして原因を探る
        res.status(200).json({ is_valid: false, reason: "AIの答え:" + rawText });
    } catch (error) {
        res.status(500).json({ is_valid: false, reason: "通信エラー" });
    }
}
