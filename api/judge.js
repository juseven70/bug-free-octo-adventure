export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    try {
        const { word, prevWord, requiredLength } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `{"word":"${word}","prevWord":"${prevWord}","length":${requiredLength}} を判定し、JSONのみで {"is_valid": true, "reason": "OK"} と回答してください。` }] }]
            })
        });

        const data = await response.json();
        // ここが一番のポイント：AIの返事からJSON部分だけを抜き出す
        const text = data.candidates[0].content.parts[0].text;
        const jsonString = text.replace(/```json|```/g, '').trim();
        
        res.status(200).json(JSON.parse(jsonString));
    } catch (error) {
        // 何が起きたかログに出す（VercelのLogsタブで見れます）
        console.error("エラー詳細:", error);
        res.status(500).json({ is_valid: false, reason: "通信エラー発生" });
    }
}
