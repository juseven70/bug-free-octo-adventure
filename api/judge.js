export default async function handler(req, res) {
    try {
        const body = JSON.parse(req.body);
        const { word, prevWord, requiredLength } = body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) throw new Error("APIキーが見つかりません");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `直前「${prevWord}」に対し「${word}」は(${requiredLength}文字、実在)か？JSONで{"is_valid": true, "reason": "OK"}と返せ` }] }]
            })
        });

        const data = await response.json();
        
        // エラー詳細をチェック
        if (data.error) throw new Error(data.error.message);
        
        const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
        res.status(200).json(JSON.parse(text));
    } catch (error) {
        // ここでエラーの内容をレスポンスとして返す
        res.status(500).json({ is_valid: false, reason: "通信エラー: " + error.message });
    }
}
