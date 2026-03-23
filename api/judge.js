export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    // APIキーの確認ログ（VercelのLogsに出る）
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("APIキーが設定されていません");
        return res.status(500).json({ is_valid: false, reason: "APIキー未設定" });
    }

    try {
        const { word, prevWord, requiredLength } = JSON.parse(req.body);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `{"word":"${word}","prevWord":"${prevWord}","length":${requiredLength}} を判定し、JSON {"is_valid": true/false, "reason": "理由"} で答えて` }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
        res.status(200).json(JSON.parse(text));
    } catch (e) {
        console.error(e);
        res.status(500).json({ is_valid: false, reason: "サーバーエラー発生" });
    }
}
