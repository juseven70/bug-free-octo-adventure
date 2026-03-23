export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    try {
        const { word, prevWord, requiredLength } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        // モデルを確実に指定するためのURL
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:runGenerateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `あなたはしりとりの審判です。直前の言葉「${prevWord}」に対し、今回の入力「${word}」は(${requiredLength}文字、実在、末尾一致)か？JSONで{"is_valid": true, "reason": "OK"} とだけ返せ。` }] 
                }]
            })
        });

        const data = await response.json();
        
        // エラー詳細ログ
        if (data.error) {
             console.error("Gemini API Error:", data.error);
             throw new Error(data.error.message);
        }
        
        const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
        res.status(200).json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ is_valid: false, reason: "通信エラー: " + error.message });
    }
}
